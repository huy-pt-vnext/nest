import { Inject, Injectable } from "@nestjs/common";
import UserResponseDto from "../dto/response/UserResponseDto";
import { UserRepository } from "../repositories/UserRepository";
import { NotFoundedException } from "../shared/exception/custom-exceptions";

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
        return UserResponseDto.toDto(user);
    }
}
