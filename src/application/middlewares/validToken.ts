import { loginExternalAPI , getTokenData } from "../services/auth.service";

export async function validToken(name?:string, password?:string): Promise <string>{
    const {currentToken, tokenExpiry} = getTokenData();
    const now = new Date();
    const buffer = 10*  1000; 

    if(
        !currentToken ||
        !tokenExpiry ||
        tokenExpiry.getTime() - now.getTime() <= buffer
    ){
        await loginExternalAPI(name||process.env.USER!,password||process.env.PASSWORD!);
    }

    return getTokenData().currentToken as string; //retorna un token valido 
}