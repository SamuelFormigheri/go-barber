import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider{
    public async saveFile(file:string): Promise<string>{
        await fs.promises.rename(
            path.resolve(uploadConfig.directory, file),
            path.resolve(uploadConfig.persistantDirectory, file)
        );
        return file;
    }
    public async deleteFile(file:string): Promise<void>{
        const filepath = path.resolve(uploadConfig.persistantDirectory, file);   

        try
        {
            await fs.promises.stat(filepath);
            await fs.promises.unlink(filepath);
        }
        catch(err)
        {
            return;
        }
    }
}