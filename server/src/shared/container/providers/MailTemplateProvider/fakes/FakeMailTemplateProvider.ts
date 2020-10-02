import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";
import IMailTemplateProvider from "../models/IMailTemplateProvider";

export default class FakeMailTemplateProvider implements IMailTemplateProvider{
    public async parse(data: IParseMailTemplateDTO): Promise<string>{
        return data.file;
    }
}