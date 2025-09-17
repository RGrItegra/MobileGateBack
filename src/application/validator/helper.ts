import { TokenResponse } from "./auth";

export function isTokenResponse(obj: any): obj is TokenResponse{
    return(
        typeof obj === "object" &&
        typeof obj.code === "number" &&
        typeof obj.message === "string" &&
        (typeof obj.enNote === "string" || obj.enNote === null) &&
        obj.token &&
        typeof obj.token.key === "string" &&
        typeof obj.token.dateFrom === "string" &&
        typeof obj.token.dateTill === "string"
    );
}