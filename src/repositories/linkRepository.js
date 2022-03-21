import { connection } from "../database.js";

export async function insert (userId, link ,shortUrl){
    const result = await connection.query(`
        INSERT INTO  links ("userId", "shortUrl", url)
            VALUES  ($1, $2, $3)
    `, [userId ,shortUrl, link])
    
    if (!result.rowCount) return false;

    return true;
}

export async function find(column, value){
    const { rows: [site]} = await connection.query(`
        SELECT  * 
        FROM  links 
        WHERE  ${column} = $1
    `, [value]);
    
    if (!site) return null;

    return site;
}

export async function update(id){
    const result = await connection.query(`
        UPDATE  links 
        SET  "visitCount" = "visitCount" + 1
        WHERE  id = $1
    `, [ id]);
    
    if (!result.rowCount) return false;

    return true;
}

export async function remove(id){
    const result = await connection.query(`
        DELETE 
            FROM  links 
            WHERE  id = $1
    `, [id]);
    
    if (!result.rowCount) return false;

    return true;
}