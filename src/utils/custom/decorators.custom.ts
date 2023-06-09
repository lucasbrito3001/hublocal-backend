import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JwtPayloadAuthGuard = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.userInfos;
});

