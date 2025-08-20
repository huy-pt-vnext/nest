import { Controller, Get, Param, ValidationPipe } from "@nestjs/common";
import { GetUserParamsDto } from "../dto/request/user/GetUserParamsDto";
import UserService from "../services/UserService";
import { ApiResponse } from "../shared/common/api-response";
import { SkipPermission } from "../shared/decorators/skip-permission.decorator";

@Controller("users")
export default class UserController {
    constructor(private readonly userService: UserService) {}

    @SkipPermission()
    @Get(":id")
    async getUserDetail(
        @Param(new ValidationPipe({ transform: true }))
        params: GetUserParamsDto,
    ) {
        const result = await this.userService.getDetailUser(params.id);
        return ApiResponse.ok(result, "User retrieved successfully");
    }
}
