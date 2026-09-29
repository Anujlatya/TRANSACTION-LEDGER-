const accountModel = require("../models/account.model");


const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const  createAccountController = asyncHandler(async(req, res) =>{

    const user = req.user;

    const account = await accountModel.create({
        user: user._id,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            { account },
            "Account created successfully"
        )
    );
})

const  getUserAccountsController = asyncHandler(async (req, res) =>{

    const accounts = await accountModel.find({
        user: req.user._id,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            { accounts },
            "Accounts retrieved successfully"
        )
    );
})

const  getAccountBalanceController = asyncHandler(async (req, res)=> {

    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id,
    }).populate("user", "name email");

    if (!account) {
        throw new ApiError(
            404,
            "Account not found"
        );
    }

    const balance = await account.getBalance();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                account,
                balance,
            },
            "Account balance retrieved successfully"
        )
    );
})

const  getAccountByNumberController = asyncHandler( async (req, res) =>{

    const { accountNumber } = req.params;

    const account = await accountModel.findOne({
        accountNumber,
    }).populate("user", "name");

    if (!account) {
        throw new ApiError(
            404,
            "Account is not exist with this account number"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                account: {
                    _id: account._id,
                    accountNumber: account.accountNumber,
                    accountHolder: account.user.name,
                    status: account.status,
                },
            },
            "Account retrieved successfully"
        )
    );
})


module.exports = { createAccountController, getUserAccountsController, getAccountBalanceController, getAccountByNumberController };