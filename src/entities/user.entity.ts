import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("users")
export class User extends BaseEntity {
    @Column({ type: "varchar", length: 255 })
    public name: string;

    @Column({ type: "varchar", length: 255, unique: true })
    public email: string;

    @Column({ type: "varchar", length: 255 })
    public password: string;

    @Column({ type: "boolean", default: true })
    public isActive: boolean;

    constructor(
        id?: string,
        name?: string,
        email?: string,
        password?: string,
        isActive = true,
        createdAt?: Date,
        updatedAt?: Date,
    ) {
        super(id, createdAt, updatedAt);
        if (name) this.name = name;
        if (email) this.email = email;
        if (password) this.password = password;
        this.isActive = isActive;
    }

    static createNew(
        name: string,
        email: string,
        password: string,
        isActive = true,
    ): User {
        const user = new User();
        user.name = name;
        user.email = email.toLowerCase();
        user.password = password;
        user.isActive = isActive;
        return user;
    }

    public activate(): void {
        this.isActive = true;
    }

    public deactivate(): void {
        this.isActive = false;
    }

    public updateProfile(name?: string, email?: string): void {
        if (name) this.name = name;
        if (email) this.email = email.toLowerCase();
    }

    public isEmailValid(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getIsActive(): boolean {
        return this.isActive;
    }

    public setIsActive(isActive: boolean): void {
        this.isActive = isActive;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(password: string): void {
        this.password = password;
    }
}
