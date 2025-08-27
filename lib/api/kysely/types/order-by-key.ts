import { Selectable } from "kysely";

export type OrderByKey<T> = keyof Selectable<T>;
