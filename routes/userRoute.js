import express from 'express';
import {blockUser, createUser,getAllUsers,getUser,loginUser, loginWithGoogle, resetPassword, sendOTP} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/send-otp", sendOTP);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/", getUser);
userRouter.get("/all", getAllUsers);
userRouter.put("/block/:email", blockUser);

export default userRouter;