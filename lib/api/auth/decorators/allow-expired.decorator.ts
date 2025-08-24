import { SetMetadata } from "@nestjs/common";

export const ALLOW_EXPIRED_KEY = "allowExpired";

export const AllowExpired = () => SetMetadata(ALLOW_EXPIRED_KEY, true);
