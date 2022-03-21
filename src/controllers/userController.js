import Conflict from '../err/ConflictError.js';
import * as userService from "../services/userService.js"

export async function createUser(req, res) {
  const user = req.body;

  try {
    await userService.create(user)

    res.sendStatus(201);
  } catch (error) {
    if (error instanceof Conflict) return res.status(error.status).send(error.message);

    console.log(error);
    res.status(500).send("Unexpected server error")
  }
}

export async function getUsers(req, res) {
  try {
    const users = await userService.listAll()

    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Unexpected server error")
  }
}

export async function getUser(req, res) {
  const { id } = req.params;

  try {
    const user = await userService.listOne(id)

    res.send(user)
  } catch (error) {
    if (error instanceof NotFound) return res.status(error.status).send(error.message);

    console.log(error);
    res.status(500).send("Unexpected server error")
  }
}