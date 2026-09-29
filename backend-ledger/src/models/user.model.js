const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { number } = require("joi");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email is required for creating a user"],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "please fill a valid email"],
        unique: [true, "email already exist"],
    },
    name: {
        type: String,
        required: [true, "Name is required for creating a user"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlenght: [6, "password should contain minimum 6 character"],
        select: false,
    },
    systemUser:{
        type: Boolean,
        default: false,
        immutable: true,
        select: false,
    },
    failedLoginAttempts:{
        type: Number,
        default: 0,
    },
    lockUntil: {
        type: Date,
        default: null,
    },  
    role: {
        type: String,
        enum: ["USER","ADMIN"],
        default: "USER",
    }
},{
    timestamps: true
})

userSchema.pre("save", async function(){ // jab kabhi bhi user userschema ko save karga toh ye check karega ki kya user ne password ko update to nhi karaha agar kara hoga to ye function us updated password ko hash me karkar save kardega 

    if(!this.isModified("password")){
        return // jab bhi async ka use kar rahe ho toh next nhi ata ha 
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash

    return 
})

userSchema.methods.comparePassword = async function(password){


    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

