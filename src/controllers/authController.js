import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { connection } from '../database.js';

export async function login(req, res) {
  const { email, password } = req.body;
  console.log(email, password)

  const { rows: users } = await connection.query('SELECT * FROM users WHERE email=$1', [email])
  const [user] = users
  console.log(user)
  if (!user) {
    return res.sendStatus(401);
  }

  if (bcrypt.compareSync(password, user.password)) {
    const token = uuid();
    await connection.query('INSERT INTO sessions (token, "userId") VALUES ($1, $2)', [token, user.id])
    console.log("ok")
    return res.send(token);
  }

  res.sendStatus(401);
}