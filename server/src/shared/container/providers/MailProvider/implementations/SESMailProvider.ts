import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import { injectable, inject} from 'tsyringe';

import mailConfig from '@config/mail';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from "../models/IMailProvider";
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class SESMailProvider implements IMailProvider{
    private client: Transporter;
    private mailTemplateProvider: IMailTemplateProvider;
    constructor(@inject('MailTemplateProvider') mailTemplateProvider: IMailTemplateProvider){
        this.mailTemplateProvider = mailTemplateProvider;
        this.client = nodemailer.createTransport({
            SES: new aws.SES({
                apiVersion: '2010-12-01',
                region: process.env.AWS_DEFAULT_REGION
            })
        });
    }
    //Change default - from - to your email configured in aws
    public async sendMail(data: ISendMailDTO): Promise<void>{
        const { name, email } = mailConfig.defaults.from;

        await this.client.sendMail({
            from: { 
                name: data.from?.name || name, 
                address: data.from?.email || email
            },
            to: { name: data.to.name, address: data.to.email},
            subject: data.subject,
            html: await this.mailTemplateProvider.parse(data.templateData)
        });
    }
}