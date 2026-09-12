import type { getAppData } from './data';
type Serialized<T> = T extends Date ? string : T extends Array<infer U> ? Serialized<U>[] : T extends object ? { [K in keyof T]: Serialized<T[K]> } : T;
export type AppData = Serialized<Awaited<ReturnType<typeof getAppData>>>;
export type Place = AppData['places'][number];
export type Route = AppData['routes'][number];
