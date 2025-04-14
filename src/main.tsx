import React from "react";
import { createRoot } from 'react-dom/client';

import  DataSet  from './components/DataSet1';
import { globalTypes, loadData } from './data';

// @ts-ignore
const root = createRoot(document.getElementById('app'));
const data = loadData();
root.render(
  <div><p>{data.displayName}</p>
    <DataSet globalTypes={globalTypes} data={data} />
  </div>,

);

