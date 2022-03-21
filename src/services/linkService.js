import { v4 as uuid } from 'uuid';
import NotFound from '../err/NotFound.js';
import Unauthorized from '../err/UnauthorizedError.js';
import * as linkRepository from "../repositories/linkRepository.js"

export async function create(userId, link){
    const shortUrl = uuid().split("-")[0];

    const result = await linkRepository.insert(userId, link ,shortUrl)
    if (!result) throw new Error();

    return shortUrl;
}

export async function access(shortUrl){
    const site = await linkRepository.find("shortUrl", shortUrl)
    if (!site) throw new NotFound("Site não encontrado")
    
    const {id, url} = site

    const result = await linkRepository.update(id)
    if (!result) throw new Error;

    return url;
}

export async function remove(id, userId){
    const url = await linkRepository.find("id", id)
    if (!url) throw new NotFound("Link não encontrado")

    if(url.userId !== userId) throw new Unauthorized("Esse link não pertence ao seu usuario")

    const result = linkRepository.remove(id)
    if (!result) throw new Error();

    return true;
}