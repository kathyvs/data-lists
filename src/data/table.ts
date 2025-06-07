
import { TableType, ColumnType, Key, RowType, Value } from '../data';
import { TypeInfo } from './types';


export class TableData {
  private readonly columns: ColumnData[];
  private readonly rootType: TypeInfo;
  private entries: RowType[];
  readonly displayName: string;

  constructor({
    tableData,
    types,
  }: {
    tableData: TableType;
    types: Map<Key, TypeInfo>;
  }) {
    this.rootType = types.get(tableData.type) as TypeInfo;
    this.columns = tableData.columns.map((c) => new ColumnData(c, this.rootType));
    this.entries = tableData.data;
    this.displayName = tableData.displayName;
  }

  getColumns() {
    return this.columns;
  }

  getRows(): RowData[] {
    return this.entries.map((row: RowType) => {
      return new RowData(row);
    })
  }

}

export class ColumnData {

  //private column: Column;
  displayName: string;
  key: string;
  className: string;
  private columnType: TypeInfo;

  constructor(column: ColumnType, rootType: TypeInfo) {
    //this.column = column;
    this.displayName = column.header;
    this.key = column.data;
    this.columnType = rootType.typeFor(this.key);
    this.className = this.columnType.className;
  }

  format(value: Value): string {
    return this.columnType.format(value);
  }

  readonly() {
    return this.columnType.readonly();
  }
}

export class RowData {
  readonly id: Key
  private readonly row: RowType;

  constructor(row: RowType) {
    this.id = row.id;
    this.row = row;
  }

  get(key: Key): Value {
    return this.row[key] || "";
  }
}

// Arrow key manipulations

type KeyResult = {
  table: string,
  column: string,
  row: string
}

export class ArrowKey {

  private static readonly BAD_KEY = new ArrowKey();

  static keyFor(id: string): ArrowKey {
    const pattern = /T(?<table>[0-9]+)(C(?<column>[0-9]+)(R(?<row>[0-9]+))?)?/;
    const result = pattern.exec(id);
    if (result) {
      const groups = result.groups as KeyResult;
      const tableKey = parseInt(groups.table);
      if (isNaN(tableKey)) {
        return ArrowKey.BAD_KEY;
      }
      if (groups.column) {
        const columnKey = parseInt(groups.column);
        if (isNaN(columnKey)) {
          return ArrowKey.BAD_KEY;
        }
        if (groups.row) {
          const rowKey = parseInt(groups.row);
          if (isNaN(rowKey)) {
            return ArrowKey.BAD_KEY;
          }
          return new CellKey(tableKey, columnKey, rowKey);
        }
        return new HeaderKey(tableKey, columnKey);
      }
      return new TabKey(tableKey);
    } else {
      return ArrowKey.BAD_KEY;
    }
  }

  static tableKey(index: number) {
    return new TabKey(index);
  }

  static headerKey(parentKey: ArrowKey, index: number) {
    return (parentKey as TabKey).columnKey(index);
  }

  up() : ArrowKey {
    return ArrowKey.BAD_KEY
  }

  down(): ArrowKey {
    return ArrowKey.BAD_KEY;
  }

  right(): ArrowKey {
    return ArrowKey.BAD_KEY;
  }

  left(): ArrowKey {
    return ArrowKey.BAD_KEY;
  }

  id() : string {
    return "";
  }

}

class TabKey extends ArrowKey {
  readonly tabValue: number;

  constructor(tabValue: number) {
    super();
    this.tabValue = tabValue;
  }

  override id(): string {
    return `T${this.tabValue}`;
  }

  override up(): ArrowKey {
    return this;
  }

  override down(): ArrowKey {
    return new HeaderKey(this.tabValue, 0);
  }

  override right(): ArrowKey {
    return new TabKey(this.tabValue + 1);
  }

  override left(): ArrowKey {
    return new TabKey(this.tabValue - 1);
  }

  columnKey(index: number) {
    return new HeaderKey(this.tabValue, index)
  }
}

class HeaderKey extends TabKey {
  readonly headerValue: number;

  constructor(tabValue: number, headerValue: number) {
    super(tabValue);
    this.headerValue = headerValue;
  }

  override id(): string {
    return `T${this.tabValue}C${this.headerValue}`;
  }

  override up(): ArrowKey {
    return new TabKey(this.tabValue);
  }

  override down(): ArrowKey {
    return new CellKey(this.tabValue, this.headerValue, 0);
  }

  override right(): ArrowKey {
    return new HeaderKey(this.tabValue, this.headerValue + 1);
  }

  override left(): ArrowKey {
    return new HeaderKey(this.tabValue, this.headerValue - 1);
  }
}

class CellKey extends HeaderKey {
  private cellValue: number;
  
  constructor(tabValue: number, headerValue: number, cellValue: number) {
    super(tabValue, headerValue);
    this.cellValue = cellValue;
  }

  override id(): string {
    return `T${this.tabValue}C${this.headerValue}R${this.cellValue}`;
  }

  override up(): ArrowKey {
    return this.cellValue < 1
      ? new HeaderKey(this.tabValue, this.headerValue)
      : new CellKey(this.tabValue, this.headerValue, this.cellValue - 1);
  }

  override down(): ArrowKey {
    return new CellKey(this.tabValue, this.headerValue, this.cellValue + 1);
  }

  override right(): ArrowKey {
    return new CellKey(this.tabValue, this.headerValue + 1, this.cellValue);
  }

  override left(): ArrowKey {
    return new CellKey(this.tabValue, this.headerValue - 1, this.cellValue);
  }
}