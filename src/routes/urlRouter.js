import { Router } from "express";
import { createShortenUrl, deleteUrl, getUrl } from "../controllers/urlsController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import urlSchema from "../schemas/urlSchema.js";

const urlRouter = Router();
urlRouter.post('/urls/shorten', validateTokenMiddleware, validateSchemaMiddleware(urlSchema), createShortenUrl);
urlRouter.get('/urls/:shortUrl', getUrl);
urlRouter.delete('/urls/:id', validateTokenMiddleware, deleteUrl);
export default urlRouter;