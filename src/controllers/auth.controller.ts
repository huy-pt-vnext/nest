import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
} from "@nestjs/common";
import { Response } from "express";
import { LoginUserDto } from "../dto/request/auth/LoginUserDto";
import { RegisterUserDto } from "../dto/request/auth/RegisterUserDto";
import UserResponseDto from "../dto/response/UserResponseDto";
import AuthService from "../services/AuthService";
import { ApiResponse } from "../shared/common/api-response";
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
    async createUser(@Body() body: RegisterUserDto) {
        const result = await this.authService.register(body);
        return ApiResponse.ok(result, "Registered successfully");
    }

    @SkipPermission()
    @Public()
    @Post("login")
    @HttpCode(HttpStatus.OK)
    async loginUser(
        @Body() body: LoginUserDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const { accessToken, refreshToken, user } =
            await this.authService.login(body);

        setAccessTokenToHeader(response, accessToken);

        setRefreshTokenToCookie(response, refreshToken);

        const userResponse = UserResponseDto.toDto(user);
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
