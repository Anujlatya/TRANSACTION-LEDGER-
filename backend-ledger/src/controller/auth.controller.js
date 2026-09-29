const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailServices = require('../services/email.service');
const tokenBlacklistModel = require('../models/blackList.model');
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");


// it is called js docs comment
/**
 * 
 * - user Register Controller
 * - post /api/auth/register
 */
const ApiError = require("../utils/ApiError");

const userRegisterController = asyncHandler( async (req, res) => {

    const { email, name, password } = req.body;

    const isExist = await userModel.findOne({
        email: email,
    });

    if (isExist) {
        throw new ApiError(
            422,
            "User already exists with this email!"
        );
    }

    const user = await userModel.create({
        name,
        email,
        password,
    });

    const token = jwt.sign(
        {
            userId: user._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "3d",
        }
    );

    res.cookie("token", token);

    res.status(201).json(
        new ApiResponse(
            201,
            {
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                token,
            },
            "Registration successfully"
        )
    );

    await emailServices.sendRegistrationEmail(
        user.email,
        user.name
    );
})

/**
 * - user login controller
 * - post /api/auth/login
 */
const  userLoginController = asyncHandler(async (req, res) =>{
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password"); // in userschema we write password select false means jab bhi user ki details fetch karenge toh default me password nhi ayega toh uske liye password ko selct karna padega

    if (!user) {
        throw new ApiError(
            401,
            "email or password is invalid"
        );
    }

    if(user.lockUntil && user.lockUntil >= Date.now()){
        throw new ApiError(403,"Account is locked Please try 15 min later");
    }

    if(user.lockUntil && user.lockUntil <= Date.now()){
        user.failedLoginAttempts = 0;
        user.lockUntil = null;

        await user.save;
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {

        user.failedLoginAttempts += 1;

        if(user.failedLoginAttempts >= 5){
            user.lockUntil = Date.now() + 15*60*1000;
        }
        await user.save();
        throw new ApiError(
            401,
            "email or password is invalid"
        );
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    const token = jwt.sign(
        {
            userId: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
    );

    res.cookie("token", token);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                token: token,
            },
            "user logedIn Successfully"
        )
    );
})

/**
 * - POST /api/auth/logout
 * - logout user
 */
const  userLogoutController = asyncHandler(async(req, res) =>{
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(200).json(
            new ApiResponse(
                200,
                [],
                "user logged out successfully"
            )
        );
    }

    await tokenBlacklistModel.create({
        token: token,
    });

    res.clearCookie("token");

    res.status(200).json(
        new ApiResponse(
            200,
            [],
            "user logged out successfully",
        )
    );
})

/**
 * - GET /api/auth/me
 * - get me api
 */
const  getMeController = asyncHandler(async(req, res) =>{
    const user = await userModel.findOne({ _id: req.user._id });

    res.status(200).json(
        new ApiResponse(
            200,
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            },
            "user fetch successfully",
        )
    )
})


module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController,
    getMeController,
}