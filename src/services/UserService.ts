import { Inject, Injectable } from "@nestjs/common";
import { NotFoundedException } from "../presentation/common";
import { UserRepository } from "../repositories/UserRepository";

@Injectable()
export default class UserService {
    constructor(
        @Inject("USER_REPOSITORY")
        private readonly userRepository: UserRepository,
    ) {}

    async getDetailUser(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundedException("User not found");
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
