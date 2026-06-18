declare module 'node:sqlite' {
  export type SqliteValue = string | number | bigint | Uint8Array | null;

  export interface StatementSync {
    run(...params: SqliteValue[]): unknown;
    get<T = unknown>(...params: SqliteValue[]): T;
    all<T = unknown>(...params: SqliteValue[]): T[];
  }

  export class DatabaseSync {
    constructor(filename: string);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
  }
}
