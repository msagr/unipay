import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

// $-title   Delete User Account
// $-path    DELETE /api/v1/user/:id
// $-auth    Private/Admin
// an admin user can delete any other user account

const deleteUserAccount = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		const { firstName } = user;
		await user.deleteOne();

		res.json({
			success: true,
			message: `User ${firstName} deleted successfully`,
		});
	} else {
		res.status(404);
		throw new Error("user not found");
	}
});

export default deleteUserAccount;