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
  try {
    const { rows: users} = await connection.query(`
         SELECT users.id, users.name, COALESCE("usersCounts".count,0) AS "linksCount", COALESCE("usersCounts".sum,0) AS "visitCount"
           FROM users
      LEFT JOIN (
                SELECT users.id AS "userId", COUNT(*), SUM("visitCount")
                FROM links
                JOIN users ON users.id = links."userId"
                GROUP BY users.id
      ) AS "usersCounts" ON "usersCounts"."userId" = users.id
        ORDER BY "visitCount" DESC
        LIMIT 10
    `)
    res.send(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUser(req, res) {
  const { id } = req.params;

  try {
    const { rows: [user]} = await connection.query(`SELECT * FROM users WHERE id=$1`,[id])
    
    if(!user) return res.sendStatus(404)

    const { rows: userLinks} = await connection.query(`
      SELECT  users.id, users.name, 
              links.id AS "linkId", links."shortUrl", links.url, links."visitCount" AS "linksVisitCount", 
              "visitSum"."totalUserVisits"
        FROM  users 
        JOIN  links ON  links."userId" = users.id
       JOIN(
              SELECT  "userId", SUM("visitCount") as "totalUserVisits"
              FROM  links
              WHERE links."userId" = $1
              GROUP BY "userId"
      ) AS "visitSum" ON "visitSum"."userId" = users.id
       WHERE  users.id = $1
    `, [id]);
    if(!userLinks.length) return res.send({shortenedUrls:[]})

    const [userObject] = userLinks
    
    const sanitazeUserLinks = {
      id:userObject.id,
      name:userObject.name,
      visitCount:userObject.totalUserVisits,
      shortenedUrls:userLinks.map(link=> ({
        id:link.linkId,
        shortUrl:link.shortUrl,
        url:link.url,
        visitCount:link.linksVisitCount
      }))
    }

    res.send(sanitazeUserLinks)
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}