const transactionModel = require('../models/transaction.model');
const accountModel = require('../models/account.model');
const ledgerModel = require('../models/ledger.model');
const mongoose = require('mongoose');
const emailService = require('../services/email.service');

const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
 *   1. Validate request
 *   2. Validate idempotency key
 *   3. Check account status
 *   4. Derive sender balance from ledger
 *   5. Create transaction (PENDING)
 *   6. Create DEBIT ledger entry
 *   7. Create CREDIT ledger entry
 *   8. Mark transaction COMPLETED
 *   9. Commit MongoDB session
 *   10. Send email notification
 */

const createTransaction = asyncHandler(async function (req, res) {

    /**
     * - Step 1: Validate request
    */
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    const fromUserAccount = await accountModel.findById(fromAccount);
    const toUserAccount = await accountModel.findById(toAccount);


    if (!fromUserAccount || !toUserAccount) {
        throw new ApiError(
            400,
            "fromAccount or toAccount not found"
        );
    }


    /**
     * - Step 2: Validate idempotency key
     */

    const isTransactionAlreadyExists = await transactionModel.findOne({ idempotencyKey });

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    { transaction: isTransactionAlreadyExists },
                    "Transaction already completed"
                )
            );
        }

        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    [],
                    "Transaction is still processing"
                )
            );
        }

        if (isTransactionAlreadyExists.status === "FAILED") {
            throw new ApiError(
                500,
                "Transaction failed"
            );
        }

        if (isTransactionAlreadyExists.status === "REVERSED") {
            throw new ApiError(
                500,
                "Transaction reversed"
            );
        }

    }

    /**
     * - step 3: check accountStatus
     */

    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        throw new ApiError(
            400,
            "Both account must be in active"
        );
    }

    /**
     * - step 4:  Derive sender balance from ledger
     */

    const balance = await fromUserAccount.getBalance();

    if (balance < amount) {
        throw new ApiError(
            400,
            `insufficient balance, your current balance ${balance},and requested amount is${amount}`
        );
    }

    let transaction;
    let session;
    try {

        /**
         * - step 5: create transaction (pending)
        */

        session = await mongoose.startSession();
        session.startTransaction();

        [transaction] = await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING",
        }], { session });

        await ledgerModel.create([{
            account: fromAccount,
            transaction: transaction._id,
            type: "DEBIT",
            amount,
        }], { session });

        await ledgerModel.create([{
            account: toAccount,
            transaction: transaction._id,
            type: "CREDIT",
            amount,
        }], { session });

        await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            { session }
        );

        await session.commitTransaction();

        /**
         * - it is completed till 9th step
        */
    } catch (error) {
        console.error("Error during transaction:", error);
        if (session) {
            await session.abortTransaction();
        }
        throw new ApiError(
            500,
            "Transaction is pending due to some error, please try again later"
        );
    } finally {
        if (session) {
            session.endSession();
        }
    }

    /**
     * - step 10: send email notification
    */

    await emailService.sendTransactionEmail(req.user.email, req.user.name, toUserAccount._id, amount);

    return res.status(201).json(
        new ApiResponse(
            201,
            { transaction },
            "Transaction created successfully",
        )
    );
})

const createInitialFundsTransaction = asyncHandler(async function (req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        throw new ApiError(
            400,
            "toAccount, amount and idempotencyKey are required"
        );
    }

    const toUserAccount = await accountModel.findById(toAccount);

    if (!toUserAccount) {
        throw new ApiError(
            400,
            "toAccount not found"
        );
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id,
    });

    if (!fromUserAccount) {
        throw new ApiError(
            400,
            "System user account not found"
        );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const [transaction] = await transactionModel.create([{
        fromAccount: fromUserAccount._id,
        toAccount,
        status: "PENDING",
        amount,
        idempotencyKey,
    }], { session });

    await ledgerModel.create([{
        account: fromUserAccount._id,
        amount,
        transaction: transaction._id,
        type: "DEBIT",
    }], { session });

    await ledgerModel.create([{
        account: toAccount,
        amount,
        transaction: transaction._id,
        type: "CREDIT",
    }], { session });

    await transactionModel.findOneAndUpdate(
        { _id: transaction._id },
        { status: "COMPLETED" },
        { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(
        new ApiResponse(
            201,
            { transaction },
            "initial funds Transaction completed successfully",
        )
    );
})

/**
 * - Safe sortable fields that exist on the transaction model.
 */
const SORTABLE_FIELDS = ["createdAt", "updatedAt", "amount"];

const  getAllTransactionOfUserController = asyncHandler(async (req, res) =>{
    const { page, limit, search, status, sort } = req.query;
/*
     * - Normalize pagination defensively. Joi validation already guarantees
     *   page>=1 and 1<=limit<=100 when the params are present; this also
     *   covers re-parsing where framework re-reads query values as strings,
     *   so page/limit defaults are applied when the params are absent.
     */
    const rawPage = Number(page);
    const rawLimit = Number(limit);
    const pageNum = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1;
    const limitNum = Number.isInteger(rawLimit) && rawLimit >= 1 ? Math.min(rawLimit, 100) : 10;

    const accounts = await accountModel.find({
        user: req.user._id,
    });

    const accountIds = accounts.map(account => account._id);

    /*
     * - Always scoped to the authenticated user's accounts.
     * - Search / status filters are added on top of this base query and are
     *   applied inside MongoDB (no in-memory filtering on Node.js).
     */
    const filter = {
        $or: [
            {
                fromAccount: {
                    $in: accountIds
                }
            },
            {
                toAccount: {
                    $in: accountIds
                }
            }
        ]
    };

    // - Filter by transaction status if provided (value already whitelisted by Joi)
    if (status) {
        filter.status = status;
    }

    /*
     * Search the only meaningful searchable string field on the transaction
     * model: idempotencyKey. The regex is escaped to prevent ReDoS / operator
     * injection and stays scoped to the user's own accounts.
     */
    if (search) {
        const sanitized = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        filter.$and = filter.$and || [];
        filter.$and.push({
            idempotencyKey: { $regex: sanitized, $options: "i" },
        });
    }

    /*
     * Sorting: only whitelisted fields from the actual transaction schema.
     * A leading "-" means descending. Defaults to newest first (createdAt desc).
     */
    const sortValue = sort || "-createdAt";
    const descending = sortValue.startsWith("-");
    const sortField = descending ? sortValue.slice(1) : sortValue;
    const sortOrder = {};
    if (SORTABLE_FIELDS.includes(sortField)) {
        sortOrder[sortField] = descending ? -1 : 1;
    } else {
        sortOrder.createdAt = -1;
    }

    const skip = (pageNum - 1) * limitNum;

    const [transactions, totalTransactions] = await Promise.all([
        transactionModel.find(filter)
            .populate("fromAccount")
            .populate("toAccount")
            .sort(sortOrder)
            .skip(skip)
            .limit(limitNum),
        transactionModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalTransactions / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPreviousPage = pageNum > 1;

    res.status(200).json(
        new ApiResponse(
            200,
            {
                transactions,
                pagination: {
                    currentPage: pageNum,
                    limit: limitNum,
                    totalTransactions,
                    totalPages,
                    hasNextPage,
                    hasPreviousPage,
                },
            },
            "transactions fetch successfully",
        )
    );
})

const  getAllLedgerOfUserController = asyncHandler(async (req, res) =>{
    const accounts = await accountModel.find({
        user: req.user._id,
    });

    const accountIds = accounts.map(acc => acc._id);

    const ledgers = await ledgerModel.find({
        account: {
            $in: accountIds,
        },
    })
        .populate({
            path: "transaction",
            populate: [
                {
                    path: "fromAccount",
                    select: "accountNumber",
                },
                {
                    path: "toAccount",
                    select: "accountNumber",
                },
            ],
        })
        .sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(
            200,
            ledgers,
            "ledger fetch successfully",
        )
    );
})

module.exports = {
    createTransaction,
    createInitialFundsTransaction,
    getAllTransactionOfUserController,
    getAllLedgerOfUserController
}