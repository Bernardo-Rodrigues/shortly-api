import bcrypt from 'bcrypt';
import { connection } from '../database.js';

export async function createUser(req, res) {
  const user = req.body;

  try {
    const existingUsers = await connection.query('SELECT * FROM users WHERE email=$1', [user.email])
    if (existingUsers.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await connection.query(`
      INSERT INTO 
        users(name, email, password) 
      VALUES ($1, $2, $3)
    `, [user.name, user.email, passwordHash])

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUsers(req, res) {
  const { user } = res.locals;

  try {
    res.send(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUser(req, res) {
  const { id } = req.params;

  try {
    let { rows: user} = await connection.query(`
        SELECT  users.id, users.name,
                SUM("visitCount") AS "visitCount",
                urls.id AS "urlId", urls."shortUrl", urls.url, urls."visitCount" AS "urlVisitCount"
          FROM  users 
          JOIN  urls
            ON  urls."userId" = users.id
          WHERE  users.id = $1
      GROUP BY  urls.id, users.id
    `, [id]);

    user = {
      id:user[0].id,
      name:user[0].name,
      visitCount:user[0].visitCount,
      shortenedUrls:user.map(url=> ({
        id:url.urlId,
        shortUrl:url.shortUrl,
        url:url.url,
        visitCount:url.urlVisitCount
      }))
    }

    if (!user) return res.sendStatus(404)
    res.send(user)
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}