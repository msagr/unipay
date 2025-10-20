import morgan from "morgan";
import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, prettyPrint } = format;

const fileRotateTransport = new transports.DailyRotateFile({
    filename: path.join(logsDir, 'unipay-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '14d',
});

export const systemLogs = createLogger({
    level: 'http',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        prettyPrint()
    ),
    transports: [
        new transports.Console(),
        fileRotateTransport,
    ],
});

export const morganMiddleware = morgan(
    'combined',
    {
        stream: {
            write: (message) => {
                systemLogs.http(message.trim());
            },
        },
    }
);