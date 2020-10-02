import nodemailer, {Transporter} from 'nodemailer';

import { injectable, inject} from 'tsyringe';

import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from "../models/IMailProvider";
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider{
    private client: Transporter;
    private mailTemplateProvider: IMailTemplateProvider;
    constructor(@inject('MailTemplateProvider') mailTemplateProvider: IMailTemplateProvider){
        nodemailer.createTestAccount().then(account =>{
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            this.client = transporter;
            this.mailTemplateProvider = mailTemplateProvider;
        });
    }
    public async sendMail(data: ISendMailDTO): Promise<void>{
        const message = await this.client.sendMail({
            from: { 
                name: data.from?.name || "Equipe GoBarber", 
                address: data.from?.email || "equipe@gobarber.com.br"
            },
            to: { name: data.to.name, address: data.to.email},
            subject: data.subject,
            html: await this.mailTemplateProvider.parse(data.templateData)
        });

        console.log('Message sent: %s', message.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}