import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class TransactionService {
    constructor(private readonly dataSource: DataSource) {}

    async executeInTransaction<T>(operation: () => Promise<T>): Promise<T> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await operation();
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    createTransaction() {
        const queryRunner = this.dataSource.createQueryRunner();
        queryRunner.connect();
        return queryRunner;
    }
}
