import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import VerificationToken from "../../models/verifyResetTokenModel.js";
import sendEmail from "../../utils/sendEmail.js";

const domainURL = process.env.DOMAIN;

const { randomBytes } = await import("crypto");

// $-title   Register User and send email verification link
// $-path    POST /api/v1/auth/register
// $-auth    Public

const registerUser = asyncHandler(async (req, res) => {
	const { email, username, firstName, lastName, password, passwordConfirm } =
		req.body;
	
	const incomingRoles = req.body.roles;
	const roles = incomingRoles === undefined
    	? undefined
    	: Array.isArray(incomingRoles)
    	? incomingRoles
    	: [incomingRoles];

	if (!username) {
		return res.status(400).json({
			success: false,
			message: "A username is required",
		});
	}
	
	if (!email) {
		return res.status(400).json({
			success: false,
			message: "An email address is required",
		});
	}

	if (!firstName || !lastName) {
		return res.status(400).json({
			success: false,
			message: "You must enter a full name with a first and last name",
		});
	}

	if (!password) {
		return res.status(400).json({
			success: false,
			message: "You must enter a password",
		});
	}

	if (!passwordConfirm) {
		return res.status(400).json({
			success: false,
			message: "Confirm password field is required",
		});
	}

	const userExists = await User.findOne({ email });

	if (userExists) {
		return res.status(400).json({
			success: false,
			message: "The email address you've entered is already associated with another account",
		});
	}

	const newUser = new User({
		email,
		username,
		firstName,
		lastName,
		password,
		passwordConfirm,
		...(roles ? { roles } : {}),
	});

	const registeredUser = await newUser.save();

	if (!registeredUser) {
		return res.status(400).json({
			success: false,
			message: "User could not be registered. Please try again.",
		});
	}

	if (registeredUser) {
		const verificationToken = randomBytes(32).toString("hex");

		let emailVerificationToken = await new VerificationToken({
			_userId: registeredUser._id,
			token: verificationToken,
		}).save();

		const emailLink = `${domainURL}/api/v1/auth/verify/${emailVerificationToken.token}/${registeredUser._id}`;

		const payload = {
			name: registeredUser.firstName,
			link: emailLink,
		};

        console.log("payload: ", payload);
        console.log("email: ", registeredUser.email);
        
		await sendEmail(
			registeredUser.email,
			"Account Verification",
			payload,
			"./emails/template/accountVerification.handlebars"
		);

		return res.status(201).json({
			success: true,
			message: `A new user ${registeredUser.firstName} has been registered! A Verification email has been sent to your account. Please verify within 15 minutes`,
		});
	}
});

export default registerUser;
