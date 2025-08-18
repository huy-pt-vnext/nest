import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
} from "@nestjs/common";
import { Response } from "express";
import { ApiResponse } from "../presentation/common";
import AuthResponseDto from "../presentation/dto/AuthResponseDto";
import {
    LoginUserInputs,
    loginUserValidationPipe,
} from "../presentation/validator/auth/loginUserSchema";
import {
    RegisterUserInputs,
    registerUserValidationPipe,
} from "../presentation/validator/auth/registerUserSchema";
import AuthService from "../services/AuthService";
import { Public } from "../shared/decorators/public.decorator";
import { SkipPermission } from "../shared/decorators/skip-permission.decorator";
import {
    clearRefreshTokenFromCookie,
    removeAccessTokenFromHeader,
    setAccessTokenToHeader,
    setRefreshTokenToCookie,
} from "../shared/helper/auth.helper";

@Controller("auth")
export default class AuthController {
    constructor(private readonly authService: AuthService) {}

    @SkipPermission()
    @Public()
    @Post("register")
    @HttpCode(HttpStatus.OK)
    async createUser(
        @Body(registerUserValidationPipe) request: RegisterUserInputs,
    ) {
        const result = await this.authService.register(request);
        return ApiResponse.ok(result, "Registered successfully");
    }

    @SkipPermission()
    @Public()
    @Post("login")
    @HttpCode(HttpStatus.OK)
    async loginUser(
        @Body(loginUserValidationPipe) request: LoginUserInputs,
        @Res({ passthrough: true }) response: Response,
    ) {
        const { accessToken, refreshToken, user } =
            await this.authService.login(request);

        setAccessTokenToHeader(response, accessToken);

        setRefreshTokenToCookie(response, refreshToken);

        const userResponse = AuthResponseDto.login(user);
        return ApiResponse.ok(
            {
                user: userResponse,
                accessToken,
            },
            "Login successful",
        );
    }

    @Post("logout")
    @HttpCode(HttpStatus.OK)
    async logout(@Res({ passthrough: true }) response: Response) {
        clearRefreshTokenFromCookie(response);
        removeAccessTokenFromHeader(response);
        return ApiResponse.ok(null, "Logout successful");
    }
}
