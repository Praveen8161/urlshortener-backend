import { ShortURL } from "../schema/shortURL.js";

export function addURL(req){
    return new ShortURL({
        ...req.body
    }).save();
}