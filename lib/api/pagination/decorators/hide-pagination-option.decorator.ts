import "reflect-metadata";

import { applyDecorators } from "@nestjs/common";
import { ApiHideProperty } from "@nestjs/swagger";

import { ClearSwaggerPropertyMetadata } from "~pagination/decorators/clear-swagger-property-metadata.decorator";

export const HidePaginationOption = () => applyDecorators(ApiHideProperty(), ClearSwaggerPropertyMetadata());
