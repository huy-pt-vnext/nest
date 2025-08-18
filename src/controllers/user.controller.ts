import { Controller, Get, Param } from "@nestjs/common";
import { ApiResponse } from "../presentation/common";
import { getDetailUserSchema } from "../presentation/validator/user";
import { ZodValidationPipe } from "../presentation/validator/zod-validation.pipe";
import UserService from "../services/UserService";
import { SkipPermission } from "../shared/decorators/skip-permission.decorator";

const getDetailUserValidationPipe = new ZodValidationPipe(getDetailUserSchema);

@Controller("users")
export default class UserController {
    constructor(private readonly userService: UserService) {}

    @SkipPermission()
    @Get(":id")
    async getUserDetail(@Param("id", getDetailUserValidationPipe) id: string) {
        const result = await this.userService.getDetailUser(id);
        return ApiResponse.ok(result, "User retrieved successfully");
    }
}
