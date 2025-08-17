import { applyDecorators } from "@nestjs/common";
import { Max, Min } from "class-validator";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

export const IsStrongPassword = () => applyDecorators(Min(MIN_PASSWORD_LENGTH), Max(MAX_PASSWORD_LENGTH));
