import { describe, expect, it } from 'vitest';
import { RowType, TableType } from '../data';
import { ArrowKey, TableData } from './table';
import { buildTypeMap } from './types';

describe('ColumnData', () => {

  describe('displayName', () => {

  })
});

describe('arrow keys', () => {

  const tabKey = ArrowKey.tableKey(3);
  const columnKey = ArrowKey.keyFor("T7C10");
  const rowKey = ArrowKey.keyFor("T2C11R333")

  describe('parsing', () => {

    ['T1', 'T5', 'T100', 'T0C1', 'T22C55', 'T3C3R0', 'T3000C201R35'].forEach((id) => {
      it (`round trips ${id}`, () => {
        const key = ArrowKey.keyFor(id);
        expect(key).not.toBeNull();
        expect((key as ArrowKey).id()).toEqual(id);
      })
    })
  })
  describe('arrow functions', () => {

    describe('tab keys', () => {
      it('should have an id of the form T<number>', () => {
        expect(tabKey.id()).to.equal("T3");
      })
      it('should return same key on up', () => {
        expect(tabKey.up()).to.deep.equal(tabKey);
      })
      it('should increment key on right', () => {
        expect(tabKey.right()).to.deep.equal(ArrowKey.keyFor("T4"));
      })
      it('should decrement key on left', () => {
        expect(tabKey.left()).to.deep.equal(ArrowKey.keyFor("T2"));
      })
      it('should add column 0 on down', () => {
        expect(tabKey.down()).to.deep.equal(ArrowKey.keyFor("T3C0"));
      })
    })
    describe('header keys', () => {
      it('should have an id of the form T<number>C<number>', () => {
        expect(columnKey.id()).to.equal("T7C10");
      })
      it('should return tab key on up', () => {
        expect(columnKey.up()).to.deep.equal(ArrowKey.keyFor("T7"));
      })
      it('should increment column on right', () => {
        expect(columnKey.right()).to.deep.equal(ArrowKey.keyFor("T7C11"));
      })
      it('should decrement column on left', () => {
        expect(columnKey.left()).to.deep.equal(ArrowKey.keyFor("T7C9"));
      })
      it('should add row 0 on down', () => {
        expect(columnKey.down()).to.deep.equal(ArrowKey.keyFor("T7C10R0"));
      })
    })
    describe('cell keys', () => {
      it('should have an id of the form T<number>C<number>R<number>', () => {
        expect(rowKey.id()).to.equal("T2C11R333");
      })
      it('should return prior row on up', () => {
        expect(rowKey.up()).to.deep.equal(ArrowKey.keyFor("T2C11R332"));
      })
      it('should return header if row is 0', () => {
        const topRowKey = ArrowKey.keyFor("T1C3R0");
        expect(topRowKey.up()).to.deep.equal(ArrowKey.keyFor("T1C3"));
      })
      it('should increment column on right', () => {
        expect(rowKey.right()).to.deep.equal(ArrowKey.keyFor("T2C12R333"));
      })
      it('should decrement column on left', () => {
        expect(rowKey.left()).to.deep.equal(ArrowKey.keyFor("T2C10R333"));
      })
      it('should add row  on down', () => {
        expect(rowKey.down()).to.deep.equal(ArrowKey.keyFor("T2C11R334"));
      })
    })
  })
})
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

  const baseTable: TableType = {
    type: "data",
    displayName: "Base Table",
    columns: [
      { data: "id", header: "Identifier" },
      { data: "name", header: "Name" },
      { data: "value", header: "Score"}
    ],
    data: []
  }

  describe('rows', () => {

    function createData(ids: number[], nameFunc: (id: number) => string, valueFunc: (id: number) => number) : RowType[] {
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

  });



});