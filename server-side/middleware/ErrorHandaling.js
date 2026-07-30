
import express from "express";
const ErrorHandler =(error , req, res, next) => {
    console.log(error);
    

    let code = error.code || 500;
    let detail = error.message || "Internal Server Error";
    let message = error.message || "Internal Server Error";

    res.status(code).json({
        data :detail,
        message:message,
        meta:null,

    })

}
export default ErrorHandler;