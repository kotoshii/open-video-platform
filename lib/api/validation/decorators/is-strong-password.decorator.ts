import { applyDecorators } from "@nestjs/common";
import { MaxLength, MinLength } from "class-validator";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

export const IsStrongPassword = () => applyDecorators(MinLength(MIN_PASSWORD_LENGTH), MaxLength(MAX_PASSWORD_LENGTH));
