export abstract class Repository<T> {
    abstract findById(id: string): Promise<T | null>;
    abstract save(entity: T): Promise<void>;
    abstract delete(id: string): Promise<void>;
    abstract findAll(): Promise<T[]>;
}
