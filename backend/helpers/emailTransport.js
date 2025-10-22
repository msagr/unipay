import "dotenv/config";
import nodemailer from "nodemailer";

let transporter;

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "staging") {
	transporter = nodemailer.createTransport({
		host: "mailhog",
		port: 1025,
	});
} else if (process.env.NODE_ENV === "production") {
	// TODO: Add production email transport
}

export default transporter;