const mongoose = require('mongoose');
const ledgerModel = require('./ledger.model');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must be accociated with a user"],
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            message: "status can be either active frozen closed",
        },
        default: "ACTIVE",
    },
    currency: {
        type: String,
        required: [true, "currency is required for creating account"],
        default: "INR"
    },
    accountNumber: {
        type: String,
        unique: true,
        required: true,
    },
}, {
    timestamps: true
})

accountSchema.index({ user: 1, status: 1 }) // it is called compound index ja bhi ham user or status dono ke bases per account ko find karenge toh usko compound index bolte ha 

accountSchema.pre("validate", async function () {

    if (!this.isNew || this.accountNumber) {
        return ;
    }

    let accountNumber;
    let exists = true;

    while (exists) {

        accountNumber =
            "10" +
            Math.floor(
                1000000000 + Math.random() * 9000000000
            );

        exists = await mongoose.models.account.findOne({
            accountNumber,
        });
    }

    this.accountNumber = accountNumber;

    return
});

accountSchema.methods.getBalance = async function () {

    const balanceData = await ledgerModel.aggregate([
        { $match: { account: this._id } },
        {
            $group: {
                _id: null,
                totalDebits: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "DEBIT"] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredits: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "CREDIT"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: { $subtract: ["$totalCredits", "$totalDebits"] }
            }
        }
    ])

    return balanceData[0]?.balance ?? 0;

}


const accountModel = mongoose.model("account", accountSchema);


module.exports = accountModel;