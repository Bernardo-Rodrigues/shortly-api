import { connection } from "../database.js";

export async function listAll (){
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

    if (!users.length) return null;

    return users;
}

export async function listOne (id){
    const { rows: userLinks} = await connection.query(`
      SELECT  users.id, users.name, 
              links.id AS "linkId", links."shortUrl", links.url, links."visitCount" AS "linksVisitCount", 
              "visitSum"."totalUserVisits"
        FROM  users 
        LEFT JOIN  links ON  links."userId" = users.id
       JOIN(
              SELECT  "userId", SUM("visitCount") as "totalUserVisits"
              FROM  links
              WHERE links."userId" = $1
              GROUP BY "userId"
      ) AS "visitSum" ON "visitSum"."userId" = users.id
       WHERE  users.id = $1
    `, [id]);

    if (!userLinks.length) return null;

    return userLinks;
}

export async function find(column, value){
    const { rows: [user] } = await connection.query(`
        SELECT * 
          FROM users 
         WHERE ${column}=$1
    `, [value])
    
    if (!user) return null;

    return user;
}

export async function insert ({name, email, password}){
    const result = await connection.query(`
      INSERT INTO users (name, email, password) 
           VALUES ($1, $2, $3)
    `, [name, email, password])
    
    if (!result.rowCount) return false;

    return true;
}