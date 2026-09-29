require("dotenv").config();
const winston = require("winston");
require("winston-daily-rotate-file");
const { combine, timestamp, json, errors } = winston.format;

const infoFilter = winston.format((info, opts) => {
    return info.level === "info" ? info : false;
})

const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: "./public/logs/app-info-%DATE%.log",
    datePattern: 'DD-MM-YYYY',
    format: combine(
        infoFilter(),
        timestamp({
            format: "DD-MM-YYYY hh:mm:ss"
        }),
        json()
    ),
})

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    transports: [fileRotateTransport],
    exceptionHandlers: [
        new winston.transports.File({ filename: './public/logs/exceptions.log' })
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: './public/logs/rejections.log' })
    ],
    defaultMeta: {
        service: 'clinic-server'
    }
});

const childLogger = logger.child();

module.exports = { childLogger };