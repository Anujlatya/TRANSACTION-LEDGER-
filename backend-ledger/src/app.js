const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(helmet());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


app.use(express.json());
app.use(cookieParser());

/**
 * - Routes required
*/
const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");
const transactionRouter = require("./routes/transaction.routes");
const errorMiddleware = require("./middleware/error.middleware");
const adminRouter = require("./routes/admin.routes");

/**
 * - use Routes
*/
app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api", adminRouter);

app.use(errorMiddleware);

module.exports = app;