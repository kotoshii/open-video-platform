import { SetMetadata } from "@nestjs/common";

export const NO_CHANNEL_KEY = "noChannel";

export const NoChannel = () => SetMetadata(NO_CHANNEL_KEY, true);
