import { loginExternalAPI , getTokenData } from "../services/auth.service";

export async function validToken(): Promise <string>{
    const {currentToken, tokenExpiry} = getTokenData();
    const now = new Date();
    const buffer = 10*  1000; 

    const user = process.env.USER;
    const password = process.env.PASSWORD;

    if(!user || !password){
        throw new Error("Las credenciales no están definidas en las variables de entorno");
    }

    if(
        !currentToken ||
        !tokenExpiry ||
        tokenExpiry.getTime() - now.getTime() <= buffer
    ){
        await loginExternalAPI( user, password);
    }

    return getTokenData().currentToken as string; //retorna un token valido 
}