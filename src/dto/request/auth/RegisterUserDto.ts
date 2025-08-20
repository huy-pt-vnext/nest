import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

export class RegisterUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsNotEmpty()
    @MinLength(8)
    @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
        message:
            "Password must contain uppercase, lowercase, numbers and special characters.",
    })
    password: string;

    @IsNotEmpty()
    @MinLength(8)
    @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
        message:
            "Confirm password must contain uppercase, lowercase, numbers and special characters.",
    })
    confirmPassword: string;
}
