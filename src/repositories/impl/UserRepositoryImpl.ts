import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { UserRepository } from "../UserRepository";
import { BaseRepositoryImpl } from "./BaseRepositoryImpl";

@Injectable()
export default class UserRepositoryImpl
    extends BaseRepositoryImpl<User>
    implements UserRepository
{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super();
    }

    async findById(id: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async save(user: User): Promise<void> {
        await this.userRepository.save(user);
    }

    async delete(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { email: email.toLowerCase() },
        });
    }

    async findActiveUsers(): Promise<User[]> {
        return await this.userRepository.find({
            where: { isActive: true },
        });
    }
}
