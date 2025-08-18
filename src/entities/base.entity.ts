import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    BaseEntity as TypeOrmBaseEntity,
    UpdateDateColumn,
} from "typeorm";

export abstract class BaseEntity extends TypeOrmBaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @CreateDateColumn({ type: "timestamp" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    public updatedAt: Date;

    protected constructor(id?: string, createdAt?: Date, updatedAt?: Date) {
        super();
        if (id) this.id = id;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    public equals(entity: BaseEntity): boolean {
        return this.id === entity.id;
    }

    getId(): string {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    setCreatedAt(createdAt: Date): void {
        this.createdAt = createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    setUpdatedAt(updatedAt: Date): void {
        this.updatedAt = updatedAt;
    }
}
