import { loginExternalAPI , getTokenData } from "../services/auth.service";

export async function validToken(usr_name?:string, usr_passwd?:string): Promise <string>{
    const {currentToken, tokenExpiry} = getTokenData();
    const now = new Date();
    const buffer = 10*  1000; 

    if(
        !currentToken ||
        !tokenExpiry ||
        tokenExpiry.getTime() - now.getTime() <= buffer
    ){
        await loginExternalAPI( usr_name!,usr_passwd!);
    }

    return getTokenData().currentToken as string; //retorna un token valido 
}