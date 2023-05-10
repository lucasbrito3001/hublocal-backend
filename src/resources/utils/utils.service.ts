import { Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class UtilsService {
    public getAuthorizationToken(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    public clearNumberString(numberString: string): string | undefined {
        const regex: RegExp = /[^0-9]/g

        if(typeof numberString !== 'string') return undefined

        return numberString.replace(regex, '')
    }
}