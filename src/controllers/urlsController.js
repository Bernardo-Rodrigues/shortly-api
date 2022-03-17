import { connection } from '../database.js';
import { v4 as uuid } from 'uuid';

export async function createShortenUrl(req, res) {
    const { url } = req.body
    const userId = res.locals.user.id

    try {
        const shortUrl = uuid().split("-")[0];

        const result = await connection.query(`
            INSERT INTO  urls ("userId", "shortUrl", url)
                 VALUES  ($1, $2, $3)
        `, [userId ,shortUrl, url])

        if (!result.rowCount) throw new Error();

        res.status(201).send({shortUrl})        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function getUrl(req, res) {
    const { id } = req.params

    try {
        const { rows: [url]} = await connection.query(`
            SELECT  id, "shortUrl", url 
              FROM  urls 
             WHERE  id = $1
        `, [id]);

        if (!url) return res.sendStatus(404)

        res.status(200).send(url)
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function deleteUrl(req, res) {
    const { id } = req.params
    const userId = res.locals.user.id

    try {
        const { rows: [url]} = await connection.query(`
            SELECT  *
              FROM  urls 
             WHERE  id = $1
        `, [id]);

        if (!url) return res.sendStatus(404)
        if(url.userId !== userId) return res.sendStatus(401)

        const result = await connection.query(`
            DELETE 
              FROM  urls 
             WHERE  id = $1
        `, [id]);

        res.sendStatus(204)
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}