import handlebars from 'handlebars';
import fs from 'fs';
import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";
import IMailTemplateProvider from "../models/IMailTemplateProvider";

export default class HandlebarsMailTemplateProvider implements IMailTemplateProvider{
    public async parse(data: IParseMailTemplateDTO): Promise<string>{
        const fileContent = await fs.promises.readFile(data.file,{
           encoding: 'utf-8' 
        });

        const parseTemplate = handlebars.compile(fileContent);

        return parseTemplate(data.variables);
    }
}