import Conflict from "../err/ConflictError.js";
import NotFound from "../err/NotFound.js";
import bcrypt from 'bcrypt';
import * as userRepository from "../repositories/userRepository.js"

export async function create(user){
    const existingUser = await userRepository.find("email", user.email)
    if (existingUser) throw new Conflict("Usuario já existente");

    const passwordHash = bcrypt.hashSync(user.password, 10);

    const result = await userRepository.insert({...user, password:passwordHash})
    if (!result) throw new Error();

    return true;
}

export async function listAll(){
    const users =  await userRepository.listAll()
    if (!users || !users?.length) throw new NoContent();
    
    return users;
}

export async function listOne(id){
    const user = await userRepository.find("id", id)
    if(!user) throw new NotFound("Usuario não existe")

    const userLinks = await userRepository.listOne(id)
    if(!userLinks) return {shortenedUrls:[]}

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
    
    return sanitazeUserLinks;
}