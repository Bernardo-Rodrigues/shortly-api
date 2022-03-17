import { connection } from '../database.js';
import { v4 as uuid } from 'uuid';

export async function createShortenUrl(req, res) {
    const { url } = req.body

    try {
        const shortUrl = uuid();

        const result = await connection.query(`
            INSERT INTO  urls ("shortUrl", url)
                 VALUES  ($1, $2)
        `, [shortUrl, url])

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