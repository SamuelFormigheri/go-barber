import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction} from 'express';
import { errors } from 'celebrate';
import 'express-async-errors';
import cors from 'cors';

import routes from './routes/index';

import '@shared/infra/database/typeorm';
import '@shared/container';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/files', express.static(uploadConfig.persistantDirectory));
app.use(rateLimiter);

app.use("/", routes);

app.use(errors());

//Tratativa de erros global
app.use((err: Error, request: Request, response: Response, next: NextFunction) =>{
    if(err instanceof AppError){
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error.'
    });
});

app.listen(3333);

/**docker start gostack-postgres */
