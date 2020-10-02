export default{
    jwt: {
        secret: process.env.APP_SECRET || '@TokenAppSecret',
        expiresIn: '1d'
    }
}