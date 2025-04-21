import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { Key, Data, Table } from '../data'
import { TableData } from '../data/table'
import { buildTypeMap, TypeInfo } from '../data/types';

function DataTable(props: {tableKey: string, tableData: Table, types: Map<Key, TypeInfo>}) : React.ReactElement {
    // @ts-ignore
    const [table, setTable] = React.useState(() => new TableData(props));
    return <div className="data-table">
        <p>{Object.keys(table)}</p>
        <table>
            <thead>
            <tr>
                {table.getColumns().map(column => (
                  <th key={column.getKey()}>{column.displayName}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {table.getRows().map(row => (
              <tr key={row.id}>
                  {table.getColumns().map(column => (
                    <td key={column.getKey()}>TBD</td>
                  ))}
              </tr>
            ))}
            </tbody>
        </table>
    </div>;
}

// @ts-ignore
function DataSet({ globalTypes, data }: { globalTypes: TypeMap, data: Data }): React.ReactElement {
    const types = buildTypeMap({...globalTypes, ...data.types})

    return (<div><Tabs>
        {Object.entries(data.dataTables).map(([tableKey, table]) =>
          <Tab key={tableKey} eventKey={tableKey} title={tableKey}>
              <DataTable tableKey = {tableKey} tableData = {table} types = {types}/>
          </Tab>)
        }
    </Tabs></div>);

}

export default DataSet;