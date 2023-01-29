import {User} from '../entities/User'
import { NextFunction, Response, Request } from 'express'

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: User | undefined = res.locals.user;
        console.log('user', user)
        if (!user) throw new Error('Unauthenticated');

        return next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({error: "Unauthenticated"});
    }
};