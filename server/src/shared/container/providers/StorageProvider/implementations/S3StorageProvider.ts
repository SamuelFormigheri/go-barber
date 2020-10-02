import fs from 'fs';
import path from 'path';
import aws, {S3} from 'aws-sdk';
import uploadConfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';

export default class S3StorageProvider implements IStorageProvider{
    private client: S3;

    constructor(){
        this.client = new aws.S3({
            region: 'us-east-1'
        });
    }

    public async saveFile(file:string): Promise<string>{
        const originalPath = path.resolve(uploadConfig.directory, file);

        const fileContent = await fs.promises.readFile(originalPath, {encoding: 'utf-8'});

        //Configurações definidas no aws
        await this.client.putObject({
           Bucket: 'app-gobarber',
           Key: file,
           ACL: 'public-read',
           Body: fileContent
        }).promise();

        await fs.promises.unlink(originalPath);
        
        return file;
    }
    public async deleteFile(file:string): Promise<void>{
        await this.client.deleteObject({
            Bucket: 'app-gobarber',
            Key: file
        }).promise();
    }
}