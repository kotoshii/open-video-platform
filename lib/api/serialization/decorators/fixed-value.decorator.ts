import { Transform } from "class-transformer";

export const FixedValue = (value: unknown) => Transform(() => value);
