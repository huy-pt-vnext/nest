import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { SKIP_PERMISSION_KEY } from "src/shared/decorators/skip-permission.decorator";

@Injectable()
export default class PermissionsGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {
        this.reflector = reflector;
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const skipPermission = this.reflector.getAllAndOverride<boolean>(
            SKIP_PERMISSION_KEY,
            [context.getHandler(), context.getClass()],
        );

        // handler check permission here
        if (skipPermission) {
            return true;
        }
        return false;
    }
}
