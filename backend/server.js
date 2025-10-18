import chalk from "chalk";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.get("/api/v1/test", (req, res) => {
    res.json({message: "Hello World"});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
