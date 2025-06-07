import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';

import { Data, Key, TableType, TypeMap } from '../data';
import { ArrowKey, ColumnData, RowData, TableData } from '../data/table';
import { buildTypeMap, TypeInfo } from '../data/types';

function Header({ column, parentKey, index}: {
  column: ColumnData;
  parentKey: ArrowKey;
  index: number}): React.ReactElement {
  const arrowKey = ArrowKey.headerKey(parentKey, index);
  return <th key={column.key} tabIndex={0} id={arrowKey.id()}>
    {column.displayName}
  </th>
}
function Cell({ column, row }: {
  column: ColumnData;
  row: RowData;
}): React.ReactElement {
  const value = column.format(row.get(column.key));
  return (
    <td className={column.className}>
      {column.readonly() ?
        <span className={`readonly-style ${column.className}`}>{value}</span>
        : <input readOnly className={column.className} value={value}/>
      }
    </td>
  );
}

function DataTable(props: {
  tableKey: string;
  tableData: TableType;
  types: Map<Key, TypeInfo>;
  arrowKey: ArrowKey;
}): React.ReactElement {
  // @ts-ignore
  const [table, setTable] = React.useState(() => new TableData(props));
  return (
    <div className="data-table">
      <Table striped bordered responsive tabIndex={0} id={props.arrowKey.id()}>
        <thead>
          <tr>
            {table.getColumns().map((column, index) => (
              <Header column={column} key={column.key} parentKey={props.arrowKey} index={index}  />
            ))}
          </tr>
        </thead>
        <tbody>
          {table.getRows().map((row) => (
            <tr key={row.id}>
              {table.getColumns().map((column) => (
                <Cell key={column.key} column={column} row={row} />
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

// @ts-ignore
function DataSet({
  globalTypes,
  data,
}: {
  globalTypes: TypeMap;
  data: Data;
}): React.ReactElement {
  const types = buildTypeMap({ ...globalTypes, ...data.types });
  const first = ArrowKey.tableKey(0);
  const [key, setKey] = useState<string>(first.id());
  return (
    <div>
      <Tabs fill justify activeKey={key} onSelect={(k) => setKey(k as string)}>
        {Object.entries(data.dataTables).map(([tableKey, table], index) => (
          <Tab key={tableKey} title={table.displayName} eventKey={ArrowKey.tableKey(index).id()}>
            <DataTable
              tableKey={tableKey}
              tableData={table}
              types={types}
              arrowKey={ArrowKey.tableKey(index)}
            />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}

export default DataSet;
