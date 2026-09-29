const userModel = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const ApiError = require("../utils/ApiError");

const getAllUser = asyncHandler(async (req, res) => {
    const users = await userModel.find({
        _id: { $ne: req.user._id },
    });

    res.status(200).json(
        new ApiResponse(
            200,
            data = users,
            "users Fetch successfully",
        )
    )
})

const getAccountsOfUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const accounts = await accountModel.find({
        user: userId,
    });

    const accountsWithBalance = await Promise.all(
        accounts.map(async (account) => {
            const balance = await account.getBalance();
            return {
                ...account.toObject(),
                balance,
            };
        })
    );

    res.status(200).json(
        new ApiResponse(
            200,
            accountsWithBalance,
            "accounts Fetch Successfully",
        )
    );
});

const getAllTransaction = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const accounts = await accountModel.find({
        user: userId,
    })

    const accountId = await accounts.map(account => account._id);

    const transaction = await transactionModel.find({
        $or: [
            {
                fromAccount: {
                    $in: accountId
                }
            },
            {
                toAccount: {
                    $in: accountId
                }
            }
        ]
    })
        .populate("fromAccount")
        .populate("toAccount")
        .sort({
            createdAt: -1
        });

    res.status(200).json(
        new ApiResponse(
            200,
            transaction,
            "transaction fetch successfully"
        )
    )
})

const updateStatus = asyncHandler(async (req, res) => {
    const { accountId } = req.params;

    const { accountStatus } = req.body;

    const account = await accountModel.findByIdAndUpdate(
        accountId,
        {
            status: accountStatus
        },
        {
            new: true
        }
    )

    if(!account){
        throw new ApiError(
            404,
            "account not found"
        )
    }
    

    res.status(200).json(
        new ApiResponse(
            200,
            account,
            "account updated successfully"
        )
    )

})

const deleteAccount = asyncHandler(async (req, res) => {
    const { accountId } = req.params;

    const account = await accountModel.findByIdAndDelete(accountId);

    if (!account) {
        throw new ApiError(
            404,
            "Account not found"
        );
    }

    res.status(200).json(
        new ApiResponse(
            200,
            account,
            "Account deleted successfully"
        )
    );
});

const updateUserRole = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["USER", "ADMIN"].includes(role)) {
        throw new ApiError(
            400,
            "Invalid role provided. Role must be USER or ADMIN."
        );
    }

    const user = await userModel.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
    );

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User role updated successfully"
        )
    );
});

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await userModel.findByIdAndDelete(userId);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    // Delete associated accounts
    await accountModel.deleteMany({ user: userId });

    res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User and associated accounts deleted successfully"
        )
    );
});

const getDashboardDetails = asyncHandler(async (req, res) => {
    const totalUser = await userModel.countDocuments();
    const totalAccounts = await accountModel.countDocuments();
    const totalTransaction = await transactionModel.countDocuments();

    const transactions = await transactionModel.find({
        status: "COMPLETED",
    })

    const totalTransactionMoney = transactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
    )

    res.status(200).json(
        new ApiResponse(
            200,
            {
                totalUser,
                totalAccounts,
                totalTransaction,
                totalTransactionMoney
            },
            "Dashboard Data fetch successfully"
        )
    )
})


module.exports = {
    getAllUser,
    getAccountsOfUser,
    getAllTransaction,
    updateStatus,
    deleteAccount,
    updateUserRole,
    deleteUser,
    getDashboardDetails
};