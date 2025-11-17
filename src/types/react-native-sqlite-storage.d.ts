// Type declarations for react-native-sqlite-storage
declare module 'react-native-sqlite-storage' {
  export interface DatabaseParams {
    name: string;
    location?: string;
  }

  export interface ResultSet {
    insertId?: number;
    rowsAffected: number;
    rows: {
      length: number;
      item: (index: number) => any;
      raw: () => any[];
    };
  }

  export interface Transaction {
    executeSql: (
      sql: string,
      params?: any[],
      success?: (tx: Transaction, result: ResultSet) => void,
      error?: (tx: Transaction, error: Error) => void
    ) => void;
  }

  export interface Database {
    transaction: (fn: (tx: Transaction) => void) => void;
    executeSql: (
      sql: string,
      params?: any[],
      success?: (result: ResultSet) => void,
      error?: (error: Error) => void
    ) => void;
    close: () => Promise<void>;
  }

  export function openDatabase(
    params: DatabaseParams,
    success?: () => void,
    error?: (error: Error) => void
  ): Database;

  export default {
    openDatabase,
  };
}
