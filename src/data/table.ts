
import { Table, Column, Key, Row, Value } from '../data';
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
    this.rootType = types.get(tableData.type) as TypeInfo;
    this.columns = tableData.columns.map((c) => new ColumnData(c, this.rootType));
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

export class ColumnData {

  //private column: Column;
  displayName: string;
  key: string;
  className: string;

  constructor(column: Column, rootType: TypeInfo) {
    //this.column = column;
    this.displayName = column.header;
    this.key = column.data;
    this.className = rootType.typeFor(this.key).className;
  }

}

export class RowData {
  readonly id: Key
  private readonly row: Row;

  constructor(row: Row) {
    this.id = row.id;
    this.row = row;
  }

  get(key: Key): Value {
    return this.row[key] || "";
  }
}