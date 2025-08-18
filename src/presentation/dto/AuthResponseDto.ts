import { User } from "../../entities/user.entity";

export default class AuthResponseDto {
    static register(user: User) {
        return {
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
        };
    }

    static login(user: User) {
        const { id, name, email } = user;
        return {
            id,
            name,
            email,
        };
    }
}
