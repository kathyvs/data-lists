import { describe, expect, it } from 'vitest';
import { Row, Table } from '../data';
import { TableData } from './table';
import { buildTypeMap } from './types';

describe('ColumnData', () => {

  describe('displayName', () => {

  })
});

describe('Table', () => {

  const rootTypeData = {
    kind: "compound",
    displayName: "Test Table",
    structure: {
      id: "id",
      name: "default",
      value: "float"
    },
    key: "id"
  }
  const types = buildTypeMap({
    id: {
      kind: "primitive",
      displayName: "ID",
      style: "id-style",
      jsonType: "string"
    },
    default: {
      kind: "primitive",
      displayName: "Auto",
      jsonType: "string",
      style: "string-style"
    },
    float: {
      kind: "primitive",
      displayName: "Float",
      jsonType: "number",
      style: "float-style"
    },
    data: rootTypeData
  });

  const baseTable: Table = {
    type: "data",
    columns: [
      { data: "id", header: "Identifier" },
      { data: "name", header: "Name" },
      { data: "value", header: "Score"}
    ],
    data: []
  }

  describe('rows', () => {

    function createData(ids: number[], nameFunc: (id: number) => string, valueFunc: (id: number) => number) : Row[] {
      return ids.map((id) =>
      { return {
          id: 'I-${id}',
          name : nameFunc(id),
          value: valueFunc(id)
      }})
    }

    it('creates a Row object for each element of the data array', () => {
      const ids = [5, 2, 1];
      const table = {...baseTable, data:  createData(ids,
          (id : number) : string => "Name for " + id,
          (id : number) : number => id * 3 / 2)};
      const tableInfo = new TableData({tableData: table, types: types});
      const rows = tableInfo.getRows();
      expect(rows).to.have.length(ids.length);
    });

  })

});