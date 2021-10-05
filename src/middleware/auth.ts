import {Request, Response, NextFunction} from 'express';
import '../utility/error'
const jwt = require('jsonwebtoken');
interface DecodedData {
    data: string
}
const authUser = (req: Request | any, res: Response, next: NextFunction) => {
    if(!req.headers['x-auth']) return res.status(401).send();
    try {
        const header_token = req.headers['x-auth'];
        jwt.verify(header_token, process.env.ACCESS_TOKEN_SALT, (err: any, decoded: DecodedData) => {
            if(err) return res.status(401).send();
            req.user_id = decoded.data;
            next();
        });
        
    } catch(e: any) {
        ErrorLog(req.method + ':' + req.url, e.message)
        res.status(402).send({ status : 'not authorized'});
    }
}

module.exports = { authUser }