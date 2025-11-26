import dotenv from "dotenv";

dotenv.config(); 


export const config = {
    baseUrl: process.env.API_BASE_URL!,
    queryUserUrl: process.env.USER_QUERY_URL!,
    routes: {
        login: process.env.API_LOGIN!,
        status: process.env.API_STATUS!,
        rate: process.env.API_RATE!,
        payment: process.env.API_PAYMENT!
    },
    device: process.env.DEVICE_UUID!,
    credentials: {
        user: process.env.USER!,
        password: process.env.PASSWORD!,
    },
};