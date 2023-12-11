import { ShortURL } from "../schema/shortURL.js";

// add new ShortURL
export function addURL(fullURL, id){
    return new ShortURL({
        fullURL,
        user: id
    }).save();
}

// get data using ShortURL
export function getShortUrl(req){
    return ShortURL.findOne({shortURL: req.params.shorturl});
}