import { Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class UtilsService {
    public getAuthorizationToken(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}