import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse } from "../api-response";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(
        _context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        return next.handle().pipe(
            map((data: unknown) => {
                if (data && typeof data === "object" && "success" in data) {
                    return data;
                }
                return ApiResponse.ok(data);
            }),
        );
    }
}
