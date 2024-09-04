import dotenv from 'dotenv';

dotenv.config({ path: "./.env" })

const configApp = {
    appPort: process.env.PORT,
    portfolioURL: process.env.PORTFOLIO_URL,
    dashboardURL: process.env.DASHBOARD_URL,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    jwtExpiryTime: process.env.JWT_EXPIRES,
    cookieExpiryTime: process.env.COOKIE_EXPIRES,
    myPortfolioId: process.env.MY_ID,
}

export default configApp;
