
import { Table, Column, Key, Row } from '../data';
import { TypeInfo } from './types';


export class TableData {
  private columns: ColumnData[];
  // @ts-ignore
  private rootType: TypeInfo;
  private entries: Row[];

  constructor({
    tableData,
    types,
  }: {
    tableData: Table;
    types: Map<Key, TypeInfo>;
  }) {
    this.rootType = types.get(tableData.type) || TypeInfo.DEFAULT_TYPE;
    this.columns = tableData.columns.map((c) => new ColumnData(c));
    this.entries = tableData.data;
  }

  getColumns() {
    return this.columns;
  }

  getRows(): RowData[] {
    return this.entries.map((row: Row) => {
      return new RowData(row);
    })
  }

}

class ColumnData {

  private column: Column;
  displayName: string;

  constructor(column: Column) {
    this.column = column;
    this.displayName = column.header;
  }

  getKey() {
    return this.column.data;
  }
}

class RowData {
  id: Key | null | undefined;

  constructor(row: Row) {
    this.id = row.id;
  }
}