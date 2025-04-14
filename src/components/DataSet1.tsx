import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { Data } from '../data'


// @ts-ignore
function DataSet( { globalTypes, data } : { globalTypes: TypeMap, data: Data } ): React.ReactElement {
    const types = {...globalTypes, ...data.types}
    const tableData   = data.dataTables;

    return(<div><Tabs>
        { Object.entries(tableData).map(([key, table]) =>
          <Tab eventKey={key} title={types[table.type].displayName}>
              <p>TBD</p>
          </Tab>)
        }
    </Tabs></div>);

}

export default DataSet;