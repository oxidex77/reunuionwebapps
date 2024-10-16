import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DataTable from '../src/controller/DataTable';
import  data  from '../src/data/sample-data.json';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <DataTable data={data} />
    </ThemeProvider>
  );
}

export default App;