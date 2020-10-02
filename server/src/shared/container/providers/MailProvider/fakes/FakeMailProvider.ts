import ISendMailDTO from "../dtos/ISendMailDTO";
import IMailProvider from "../models/IMailProvider";

export default class FakeMailProvider implements IMailProvider{
    private messages: ISendMailDTO[] = [];

    public async sendMail(data: ISendMailDTO): Promise<void>{
        this.messages.push(data);
    }
}