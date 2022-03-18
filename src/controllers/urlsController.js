import { connection } from '../database.js';
import { v4 as uuid } from 'uuid';

export async function createShortenUrl(req, res) {
    const { link } = req.body
    const userId = res.locals.user.id
    
    try {
        const shortUrl = uuid().split("-")[0];

        const result = await connection.query(`
            INSERT INTO  links ("userId", "shortUrl", url)
                 VALUES  ($1, $2, $3)
        `, [userId ,shortUrl, link])

        if (!result.rowCount) throw new Error();

        res.status(201).send({shortUrl})        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function getUrl(req, res) {
    const { shortUrl } = req.params

    try {
        const { rows: [site]} = await connection.query(`
            SELECT  * 
              FROM  links 
             WHERE  "shortUrl" = $1
        `, [shortUrl]);

        if (!site) return res.sendStatus(404)
        
        const {id, url, visitCount} = site

        await connection.query(`
            UPDATE  links 
               SET  "visitCount" = $1
             WHERE  id = $2
        `, [(visitCount + 1), id]);
        res.redirect(url)
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
              FROM  links 
             WHERE  id = $1
        `, [id]);

        if (!url) return res.sendStatus(404)
        if(url.userId !== userId) return res.sendStatus(401)

        const result = await connection.query(`
            DELETE 
              FROM  links 
             WHERE  id = $1
        `, [id]);

        res.sendStatus(204)
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}