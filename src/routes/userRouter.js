import { Router } from "express";
import { createUser, getUser, getUsers } from "../controllers/userController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import userSchema from "../schemas/userSchema.js";

const userRouter = Router();
userRouter.post('/users', validateSchemaMiddleware(userSchema), createUser);
userRouter.get('/users/ranking', getUsers);
userRouter.get('/users/:id', getUser);
export default userRouter;