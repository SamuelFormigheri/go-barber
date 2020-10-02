export default interface ICacheProvider{
    save(key: string, value: any): Promise<void>;
    get<T>(key: string): Promise<T | null>;
    delete(key: string): Promise<void>;
    deletePrefix(prefix: string): Promise<void>;
}