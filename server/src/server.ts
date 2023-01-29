import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source"
import authRoutes from './routes/auth'
import subRoutes from './routes/subs'
import cors from 'cors';
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import postRoutes from './routes/posts';
import voteRoutes from './routes/votes';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const origin = process.env.ORIGIN
console.log('origin', origin)

app.use(cors({
    origin,
    credentials: true
}))

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.get('/', (_, res) => res.send('running'))
app.use('/api/auth', authRoutes)
app.use('/api/subs', subRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/votes', voteRoutes)
app.use("/api/users", userRoutes)

app.use(express.static('public'))

let port = process.env.PORT;

app.listen(port, async () => {
    console.log(`Server running at ${process.env.APP_URL}`);

    AppDataSource.initialize().then(() => {
        console.log("Database Initialized")
    }).catch(error => console.log(error))
});