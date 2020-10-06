interface IMailConfig{
    driver: 'ethereal' | 'ses';

    defaults: {
        from: {
            email: string;
            name: string;
        }
    }
}

export default {
    driver: process.env.MAIL_DRIVER || 'ethereal',

    defaults: {
        from: {
            email: 'emailconfiguredonaws@hotmail.com',
            name: 'user name of email below'
        }
    }
} as IMailConfig;