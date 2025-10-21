import express from "express";

import createCustomer from "../controllers/customer/createCustomer.js";
import deleteCustomer from "../controllers/customer/deleteCustomer.js";
import getAllUserCustomers from "../controllers/customer/getAllUserCustomer.js";
import getSingleUserCustomer from "../controllers/customer/getSingleUserCustomer.js";
import updateCustomerInfo from "../controllers/customer/updateCustomerInfo.js";
import checkAuth from "../middleware/checkAuthMiddleware.js";

const router = express.Router();

// create a new customer at /api/v1/customer/create
router.route("/create").post(checkAuth, createCustomer);

// get all of a users customers at /api/v1/customer/all
router.route("/all").get(checkAuth, getAllUserCustomers);

// router.route("/:id/amount_due").get(checkAuth, getAmountDue);

// get, update and delete a customer
router
	.route("/:id")
	.get(checkAuth, getSingleUserCustomer)
	.patch(checkAuth, updateCustomerInfo)
	.delete(checkAuth, deleteCustomer);

export default router;