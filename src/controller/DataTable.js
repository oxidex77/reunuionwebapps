import React, { useMemo, useState, useCallback } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { 
  Box, 
  Button, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Checkbox, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Typography

} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const DataTable = ({ data }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [grouping, setGrouping] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [numberRange, setNumberRange] = useState({ min: '', max: '' });

  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      filterFn: 'equals',
    },
    {
      accessorKey: 'name',
      header: 'Name',
      filterFn: 'contains',
    },
    {
      accessorKey: 'category',
      header: 'Category',
      filterFn: 'equals',
    },
    {
      accessorKey: 'subcategory',
      header: 'Subcategory',
      filterFn: 'equals',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      filterFn: 'betweenInclusive',
      Cell: ({ cell }) => dayjs(cell.getValue()).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      filterFn: 'betweenInclusive',
      Cell: ({ cell }) => dayjs(cell.getValue()).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      filterFn: 'betweenInclusive',
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return value !== undefined && value !== null ? `$${value.toFixed(2)}` : 'N/A';
      },
    },
    {
      accessorKey: 'sale_price',
      header: 'Sale Price',
      filterFn: 'betweenInclusive',
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return value !== undefined && value !== null ? `$${value.toFixed(2)}` : 'N/A';
      },
    },
  ], []);
  const handleCategoryFilterChange = useCallback((event) => {
    const category = event.target.value;
    setColumnFilters(prev => {
      if (category === "") {
        return prev.filter(f => f.id !== 'category');
      } else {
        return [
          ...prev.filter(f => f.id !== 'category'),
          { id: 'category', value: category }
        ];
      }
    });
  }, []);

  const handleDrawerToggle = useCallback(() => {
    setDrawerOpen((prev) => !prev);
  }, []);

  const handleGroupingChange = useCallback((column) => {
    setGrouping(prev => 
      prev.includes(column) 
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  }, []);

  const handleColumnVisibilityChange = useCallback((column) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  }, []);

  const handleSortingChange = useCallback((updater) => {
    setSorting(updater);
  }, []);

  const handleDateRangeChange = useCallback((start, end) => {
    setDateRange({ start, end });
    if (start && end) {
      setColumnFilters(prev => [
        ...prev.filter(f => f.id !== 'createdAt'),
        { 
          id: 'createdAt', 
          value: [start.toISOString(), end.toISOString()],
          filterFn: 'betweenInclusive' 
        }
      ]);
    }
  }, []);

  const handleNumberRangeChange = useCallback((min, max) => {
    setNumberRange({ min, max });
    if (min !== '' && max !== '') {
      setColumnFilters(prev => [
        ...prev.filter(f => f.id !== 'price'),
        { 
          id: 'price', 
          value: [Number(min), Number(max)],
          filterFn: 'betweenInclusive' 
        }
      ]);
    }
  }, []);

  const uniqueCategories = useMemo(() => 
    [...new Set(data.map(item => item.category))],
    [data]
  );

  const tableState = useMemo(() => ({
    grouping,
    columnVisibility,
    sorting,
    globalFilter,
    columnFilters,
  }), [grouping, columnVisibility, sorting, globalFilter, columnFilters]);

  if (!data || !Array.isArray(data)) {
    return <div>No data available</div>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, maxWidth: '1000px', margin: '0 auto' }}>
        <Button onClick={handleDrawerToggle}>Open Settings</Button>
        <MaterialReactTable
          columns={columns}
          data={data}
          enableGrouping
          enableColumnFilters
          enableGlobalFilter
          enablePagination
          enableSorting
          state={tableState}
          onGroupingChange={setGrouping}
          onColumnVisibilityChange={setColumnVisibility}
          onSortingChange={handleSortingChange}
          onGlobalFilterChange={setGlobalFilter}
          onColumnFiltersChange={setColumnFilters}
        />
      </Box>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <Box sx={{ width: 300, padding: 2 }} role="presentation">
          <List>
            <ListItem>
              <Typography variant="h6">Grouping</Typography>
            </ListItem>
            <ListItem>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {columns.map((column) => (
                  <Box key={column.accessorKey} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      checked={grouping.includes(column.accessorKey)}
                      onChange={() => handleGroupingChange(column.accessorKey)}
                    />
                    <Typography variant="body2">{column.header}</Typography>
                  </Box>
                ))}
              </Box>
            </ListItem>
            
            <ListItem>
              <Typography variant="h6">Show/Hide Columns</Typography>
            </ListItem>
            <ListItem>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {columns.map((column) => (
                  <Box key={column.accessorKey} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      checked={!columnVisibility[column.accessorKey]}
                      onChange={() => handleColumnVisibilityChange(column.accessorKey)}
                    />
                    <Typography variant="body2">{column.header}</Typography>
                  </Box>
                ))}
              </Box>
            </ListItem>
            
            <ListItem>
              <Typography variant="h6">Sorting</Typography>
            </ListItem>
            <ListItem>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {columns.map((column) => (
                  <Button
                    key={column.accessorKey}
                    variant="outlined"
                    size="small"
                    onClick={() => handleSortingChange(prev => {
                      const existing = prev.find(sort => sort.id === column.accessorKey);
                      if (existing) {
                        if (existing.desc) {
                          return prev.filter(sort => sort.id !== column.accessorKey);
                        }
                        return prev.map(sort => 
                          sort.id === column.accessorKey ? { ...sort, desc: true } : sort
                        );
                      }
                      return [...prev, { id: column.accessorKey, desc: false }];
                    })}
                  >
                    {column.header}
                  </Button>
                ))}
              </Box>
            </ListItem>
            
            <ListItem>
              <TextField
                fullWidth
                label="Fuzzy Text Filter"
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </ListItem>
            
            <ListItem>
              <FormControl fullWidth>
                <InputLabel>Filter by Category</InputLabel>
                <Select
                  value={columnFilters.find(f => f.id === 'category')?.value ?? ''}
                  onChange={handleCategoryFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  {uniqueCategories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>
            
            <ListItem>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <DatePicker
                    label="Start Date"
                    value={dateRange.start}
                    onChange={(newValue) => handleDateRangeChange(newValue, dateRange.end)}
                  />
                  <DatePicker
                    label="End Date"
                    value={dateRange.end}
                    onChange={(newValue) => handleDateRangeChange(dateRange.start, newValue)}
                  />
                </Box>
              </LocalizationProvider>
            </ListItem>
            
            <ListItem>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Min Price"
                  type="number"
                  value={numberRange.min}
                  onChange={(e) => handleNumberRangeChange(e.target.value, numberRange.max)}
                />
                <TextField
                  label="Max Price"
                  type="number"
                  value={numberRange.max}
                  onChange={(e) => handleNumberRangeChange(numberRange.min, e.target.value)}
                />
              </Box>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default DataTable;