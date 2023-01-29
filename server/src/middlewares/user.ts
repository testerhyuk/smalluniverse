import jwt from 'jsonwebtoken'
import { NextFunction, Response, Request } from 'express'
import {User} from '../entities/User';
import dotenv from 'dotenv'

dotenv.config();

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) return next();

        const {username}: any = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOneBy({username});

        res.locals.user = user;

        return next();

    } catch (error) {
        console.log(error);
        return res.status(400).json({error: "Something went wrong"});
    }
};