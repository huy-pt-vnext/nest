import { User } from "../entities/user.entity";
import { Repository } from "./BaseRepository";

export interface UserRepository extends Repository<User> {
    findByEmail(email: string): Promise<User | null>;
    findActiveUsers(): Promise<User[]>;
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    delete(id: string): Promise<void>;
    findAll(): Promise<User[]>;
}
