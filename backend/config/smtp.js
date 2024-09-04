import dotenv from 'dotenv';

dotenv.config({ path: "./.env" })

const configApp = {
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    email: process.env.SMPT_MAIL,
    password: process.env.SMPT_PASSWORD,
}

export default configApp;
