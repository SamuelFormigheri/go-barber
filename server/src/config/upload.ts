import path from 'path';
import crypto from 'crypto';
import multer,{StorageEngine} from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
const uploadsFolder = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');

interface IUploadConfig{
    driver: 's3' | 'disk';
    directory: string;
    persistantDirectory: string;
    config: {
        disk: {
            storage: StorageEngine;
        };
        aws:{
            bucket: string;
        }
    };
}

export default {
    driver: process.env.STORAGE_DRIVER || 'disk',

    directory: tmpFolder,
    persistantDirectory: uploadsFolder,

    config : {
        disk: {
            storage: multer.diskStorage({
               destination:  tmpFolder,
               filename(request, file, callback) {
                   const fileHash = crypto.randomBytes(10).toString('hex');
                   const fileName = `${fileHash}-${file.originalname}`;
        
                   return callback(null, fileName);
               }
            })
        },
        aws: {
            bucket: 'app-gobarber'
        }
    }
} as IUploadConfig;