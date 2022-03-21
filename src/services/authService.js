import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import Unauthorized from '../err/UnauthorizedError.js';
import * as userRepository from "../repositories/userRepository.js"
import * as authRepository from "../repositories/authRepository.js"

export async function login(email, password){
    const user = await userRepository.find("email", email)
    if (!user) throw new Unauthorized("Email ou senha inválidos")
  
    if (bcrypt.compareSync(password, user.password)) {
        const token = uuid();
        const result = await authRepository.insert(token, user.id)
        if (!result) throw new Error();

        return ({token, id:user.id});
    }

    throw new Unauthorized("Email ou senha inválidos")
}
