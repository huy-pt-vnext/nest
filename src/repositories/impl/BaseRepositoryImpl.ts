import { Repository } from "src/repositories/BaseRepository";

export abstract class BaseRepositoryImpl<T> implements Repository<T> {
    abstract findById(id: string): Promise<T | null>;
    abstract save(entity: T): Promise<void>;
    abstract delete(id: string): Promise<void>;
    abstract findAll(): Promise<T[]>;
}
