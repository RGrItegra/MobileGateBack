
export interface TokenResponse{
    code: number;
    message: string;
    token:{
        key: string;
        dateFrom: string;
        dateTill: string;
    };
    enNote: string | null;
}