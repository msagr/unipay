import morgan from "morgan";
import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, prettyPrint } = format;

const fileRotateTransport = new transports.DailyRotateFile({
    filename: "logs/unipay-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "10m",
    maxFiles: "14d",
});

export const systemLogs = createLogger({
    level: "http",
    format: combine(
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        prettyPrint()
    ),
    transports: [
        new transports.Console(), 
        new transports.File({
            filename: "logs/app.log" 
        })
    ],
    // exceptionHandlers: [
    //     new transports.File({
    //         filename: "logs/exceptions.log"
    //     })
    // ],
    // rejectionHandlers: [
    //     new transports.File({
    //         filename: "logs/rejections.log"
    //     })
    // ]
});

export const morganMiddleware = morgan(
    'combined',
    {
        stream: {
            write: (message) => {
                console.log('HTTP Request:', message.trim());
            }
        }
    }
);