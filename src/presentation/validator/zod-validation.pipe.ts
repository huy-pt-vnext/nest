import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { z } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: z.ZodSchema) {}

    transform(value: any) {
        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        } catch {
            throw new BadRequestException("Validation failed");
        }
    }
}
