import dotenv from 'dotenv';

dotenv.config({ path: "./.env" })

const configApp = {
    appPort: process.env.PORT,
    portfolioURL: process.env.PORTFOLIO_URL,
    dashboardURL: process.env.DASHBOARD_URL,
}

export default configApp;
