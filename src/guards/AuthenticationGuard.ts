import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";
import { PUBLIC_KEY } from "src/shared/decorators/public.decorator";
import AuthService from "../services/AuthService";
import {
    extractAccessTokenFromHeader,
    extractRefreshTokenFromCookie,
    setAccessTokenToHeader,
    setRefreshTokenToCookie,
} from "../shared/helper/auth.helper";

@Injectable()
export default class AuthenticationGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        const accessToken = extractAccessTokenFromHeader(request);
        const refreshToken = extractRefreshTokenFromCookie(request);

        if (!accessToken || !refreshToken) {
            throw new UnauthorizedException(
                "Authentication tokens are required",
            );
        }

        try {
            const data = await this.authService.ensureAuthenticated(
                accessToken,
                refreshToken,
            );

            setAccessTokenToHeader(response, data.accessToken);

            setRefreshTokenToCookie(response, data.refreshToken);

            const user = data.user;

            (request as any).user = user;

            return true;
        } catch (error) {
            throw new UnauthorizedException(
                error.message || "Authentication failed",
            );
        }
    }
}
