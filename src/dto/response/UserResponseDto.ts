import { User } from "../../entities/user.entity";

export default class UserResponseDto {
    static toDto(user: User) {
        const { id, name, email } = user;
        return {
            id,
            name,
            email,
        };
    }
}
