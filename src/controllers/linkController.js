import NotFound from '../err/NotFound.js';
import * as linkService from "../services/linkService.js"

export async function createShortenUrl(req, res) {
    const { link } = req.body
    const userId = res.locals.user.id
    
    try {
        const shortUrl = await linkService.create(userId, link)

        res.status(201).send({shortUrl})        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function getLink(req, res) {
    const { shortUrl } = req.params

    try {
        const url = await linkService.access(shortUrl)
        
        res.redirect(url)
    } catch (error) {
        if (error instanceof NotFound) return res.status(error.status).send(error.message);

        console.log(error);
        return res.sendStatus(500);
    }
}

export async function deleteLink(req, res) {
    const { id } = req.params
    const userId = res.locals.user.id

    try {
        await linkService.remove(id, userId)
        
        res.sendStatus(200)
    } catch (error) {
        if (error instanceof NotFound) return res.status(error.status).send(error.message);

        console.log(error);
        return res.sendStatus(500);
    }
}