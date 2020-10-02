import ICacheProvider from '../models/ICacheProvider';

interface ICacheData {
    [key: string]: string;
}

export default class RedisCacheProvider implements ICacheProvider{
    private cache: ICacheData = {};

    public async save(key: string, value: any): Promise<void>{
        this.cache[key] = JSON.stringify(value);
    };

    public async get<T>(key: string): Promise<T | null>{
        const data = this.cache[key];

        if(!data){
            return null;
        }

        const parsedData = JSON.parse(data) as T;

        return parsedData;
    };

    public async delete(key: string): Promise<void>{
        delete this.cache[key];
    };

    public async deletePrefix(prefix: string): Promise<void>{
        const keys = Object.keys(this.cache).filter(key => key.startsWith(`${prefix}:`));

        keys.forEach(key =>{
            delete this.cache[key];
        })
    };
}