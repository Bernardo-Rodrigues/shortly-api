import { Router } from "express";
import { createShortenUrl, deleteLink, getLink } from "../controllers/linkController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import linkSchema from "../schemas/linkSchema.js";

const linkRouter = Router();
linkRouter.post('/urls/shorten', validateTokenMiddleware, validateSchemaMiddleware(linkSchema), createShortenUrl);
linkRouter.get('/urls/:shortUrl', getLink);
linkRouter.delete('/urls/:id', validateTokenMiddleware, deleteLink);
export default linkRouter;