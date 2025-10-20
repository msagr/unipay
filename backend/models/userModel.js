import bcrypt from "bcryptjs";
import "dotenv/config";
import mongoose from "mongoose";
import validator from "validator";
import {USER} from "../constants/index.js";

const {Schema} = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(value) {
                return /^[a-z][a-z0-9-_]{3,23}$/i.test(value);
            },
            message: "Must start with letter, use a-z, 0-9, -, _"
        }
    },
    email: {
        type: String,
        required: [true, "Email required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, "Invalid email"]
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value) => validator.isAlpha(value, 'en-US', {ignore: ' '}),
            message: "Letters only"
        }
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value) => validator.isAlpha(value, 'en-US', {ignore: ' '}),
            message: "Letters only"
        }
    },
    password: {
        type: String,
        required: [true, "Password required"],
        trim: true,
        minlength: [8, "Password must be at least 8 characters long"]
    },
    passwordConfirm: {
        type: String,
        required: function() {
            return this.isNew; 
        },
        validate: {
            validator: function(value) {
                return this.password === value;
            },
            message: "Passwords do not match"
        }
    },
    isEmailVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    provider: {
        type: String,
        required: true,
        default: "email"
    },
    googleID: String,
    avatar: String,
    businessName: String,
    phoneNumber: {
        type: String,
        default: "+121234567890",
        validate: {
            validator: function(v) {
                return /^[+]?[0-9\s-()]{10,20}$/.test(v);
            },
            message: "Please enter a valid phone number"
        }
    },
    address: String,
    city: String,
    country: String,
    passwordChangedAt: Date,
    roles: {
        type: [String],
        default: [USER]
    },
    active: {
        type: Boolean,
        default: true
    },
    refreshToken: [String],
}, {
    timestamps: true
});

userSchema.pre("save", async function(next) {
    if (!this.roles || this.roles.length === 0) {
        this.roles = [USER];
    }
    next();
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        this.passwordConfirm = undefined;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password") || this.isNew) {
		return next();
	}

	this.passwordChangedAt = Date.now();
	next();
});

userSchema.methods.comparePassword = async function (givenPassword) {
	return await bcrypt.compare(givenPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
