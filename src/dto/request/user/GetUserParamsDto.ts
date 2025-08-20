import { IsNotEmpty, IsUUID } from "class-validator";

export class GetUserParamsDto {
    @IsNotEmpty()
    @IsUUID("4", { message: "Invalid user ID format" })
    id: string;
}
