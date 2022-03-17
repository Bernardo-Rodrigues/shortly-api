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

    try {
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function deleteUrl(req, res) {

        try {
        } catch (error) {
        console.log(error);
        return res.sendStatus(500);
        }
  }