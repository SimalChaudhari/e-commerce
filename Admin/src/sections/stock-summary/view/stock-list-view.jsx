import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
    useTable,
    emptyRows,
    rowInPage,
    TableNoData,
    getComparator,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table';

import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { getProductStatusOptions, TABLE_STOCK_HEAD } from '../../../components/constants';
import { applyFilter } from '../utils';
import { useFetchStockData } from '../components/fetch-stock';
import { StockTableFiltersResult } from './table/stock-table-filters-result';
import { StockTableRow } from './table/stock-table-row';
import { StockTableToolbar } from './table/stock-table-toolbar';
import { syncStock } from 'src/store/action/stockSummaryActions';

// ----------------------------------------------------------------------
export function StockListView() {
    const table = useTable();
    const confirm = useBoolean();
    const confirmSync = useBoolean(); // Separate confirmation state for syncing
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]); // Store selected row IDs
    const [deleting, setDeleting] = useState(false); // Track delete operation
   

    const { fetchData,deleteAllItems } = useFetchStockData(); // Destructure fetchData from the custom hook
    const dispatch = useDispatch();
    const _stock = useSelector((state) => state.stock?.stock || []);
    const [tableData, setTableData] = useState(_stock);
    const options = _stock.map(opt => ({
        group: opt.group,
        subGroup1: opt.subGroup1,
        subGroup2: opt.subGroup2,

    }));
    // Update the initial state to include lastName, email, and mobile
    const filters = useSetState({ searchTerm: '', itemName: '', group: '', subGroup1: '', subGroup2: '' });

    //----------------------------------------------------------------------------------------------------
    useEffect(() => {
        fetchData(); // Call fetchData when the component mounts
    }, []);

    useEffect(() => {
        setTableData(_stock);
    }, [_stock]);
    //----------------------------------------------------------------------------------------------------

    const handleSelectRow = useCallback((id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    }, []);


    
    const handleDeleteSelectedRows = useCallback(async () => {
        setDeleting(true); // Start loading for delete operation
        try {
            await deleteAllItems(selectedRows);
            setSelectedRows([]);
            fetchData(); // Refresh data after deletion
            confirm.onFalse();
        } catch (error) {
            console.error("Error deleting selected rows:", error);
            // Optionally, show an error message to the user here
        } finally {
            setDeleting(false); // Stop loading after delete operation
        }
    }, [selectedRows, fetchData, deleteAllItems, confirm]);


    //----------------------------------------------------------------------------------------------------
    // Clear specific group
    const onClearGroup = useCallback((group) => {
        filters.setState((prevState) => ({
            ...prevState,
            group: prevState.group.filter((g) => g !== group)
        }));
    }, [filters]);

    // Clear specific subGroup1
    const onClearSubGroup1 = useCallback((subGroup1) => {
        filters.setState((prevState) => ({
            ...prevState,
            subGroup1: prevState.subGroup1.filter((sub1) => sub1 !== subGroup1)
        }));
    }, [filters]);

    // Clear specific subGroup2
    const onClearSubGroup2 = useCallback((subGroup2) => {
        filters.setState((prevState) => ({
            ...prevState,
            subGroup2: prevState.subGroup2.filter((sub2) => sub2 !== subGroup2)
        }));
    }, [filters]);





    //-----------------------------------------------------------------

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
    });

    const canReset = !!filters.state.searchTerm || filters.state.group || filters.state.subGroup1 || filters.state.subGroup2 || filters.state.status !== 'all';
    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    //----------------------------------------------------------------------------------------------------

    // Function to trigger sync API after confirmation
    const handleSyncAPI = useCallback(async () => {
        setLoading(true); // Set loading to true while syncing
        try {
            const res = await dispatch(syncStock()); // Call the sync API
            if (res) {
                fetchData(); // Fetch data after syncing
            }
        } catch (error) {
            console.error("Failed to sync Stocks", error);
        } finally {
            setLoading(false); // Reset loading state
            confirmSync.onFalse(); // Close the confirmation dialog
        }
    }, [dispatch, fetchData, confirmSync]);

    //----------------------------------------------------------------------------------------------------

    return (
        <>
            <DashboardContent maxWidth="2xl">
                <CustomBreadcrumbs
                    heading="List"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Stocks', href: paths?.dashboard?.stocks?.root },
                        { name: 'List' },
                    ]}
                    action={
                        <Button
                            // href={paths?.dashboard?.user?.new}
                            onClick={confirmSync.onTrue} // Open the sync confirmation dialog
                            variant="contained"
                            startIcon={<Iconify icon="eva:sync-fill" />}
                            disabled={loading}
                        >
                            {loading ? 'Syncing...' : 'Sync Stocks'}
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />

                <Card>
                    <StockTableToolbar
                        options={options}
                        filters={filters}
                        onResetPage={table.onResetPage}

                    />
                    {canReset && (
                        <StockTableFiltersResult
                            filters={filters}
                            totalResults={dataFiltered.length}
                            onResetPage={table.onResetPage}
                            onClearGroup={onClearGroup} // Pass clear group callback
                            onClearSubGroup1={onClearSubGroup1} // Pass clear subGroup1 callback
                            onClearSubGroup2={onClearSubGroup2} // Pass clear subGroup2 callback

                            sx={{ p: 2.5, pt: 0 }}
                        />
                    )}

                    <Box sx={{ position: 'relative' }}>
                        <TableSelectedAction
                            dense={table.dense}
                            numSelected={selectedRows.length}
                            rowCount={dataFiltered.length}
                            onSelectAllRows={(checked) => setSelectedRows(checked ? dataFiltered.map(row => row.id) : [])}

                            action={
                                <Tooltip title="Delete">
                                    <IconButton color="primary" onClick={confirm.onTrue}>
                                        <Iconify icon="solar:trash-bin-trash-bold" />
                                    </IconButton>
                                </Tooltip>
                            }
                        />

                        <Scrollbar>
                            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                                <TableHeadCustom
                                    order={table.order}
                                    orderBy={table.orderBy}
                                    headLabel={TABLE_STOCK_HEAD}
                                    rowCount={dataFiltered.length}
                                    numSelected={selectedRows.length}
                                    onSort={table.onSort}
                                    onSelectAllRows={(checked) =>
                                        setSelectedRows(checked ? dataFiltered.map((row) => row.id) : [])
                                    }

                                />

                                <TableBody>
                                    {dataFiltered.slice(
                                        table.page * table.rowsPerPage,
                                        table.page * table.rowsPerPage + table.rowsPerPage
                                    ).map((row) => (
                                        <StockTableRow
                                            key={row.id}
                                            row={row}
                                            selected={selectedRows.includes(row.id)}
                                            onSelectRow={() => handleSelectRow(row.id)}


                                        />
                                    ))}

                                    <TableEmptyRows
                                        height={table.dense ? 56 : 56 + 20}
                                        emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                                    />

                                    <TableNoData notFound={notFound} />
                                </TableBody>
                            </Table>
                        </Scrollbar>

                    </Box>

                    <TablePaginationCustom
                        page={table.page}
                        dense={table.dense}
                        count={dataFiltered.length}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        onChangeDense={table.onChangeDense}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                    />
                </Card>
            </DashboardContent>

            {/* Sync Confirmation Dialog */}
            <ConfirmDialog
                open={confirmSync.value}
                onClose={confirmSync.onFalse}
                content={
                    <Box>
                        <Typography gutterBottom>Are you sure you want to sync the Stocks?</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            This action will update the stocks data and may take a few moments.
                        </Typography>
                    </Box>
                }
                action={
                    <Button
                        onClick={handleSyncAPI} // Trigger sync API call on confirmation
                        variant="contained"
                        color="primary"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? 'Syncing...' : 'Confirm Sync'}
                    </Button>
                }
            />

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete Stocks?"
                content={
                    <Box>
                        <Typography gutterBottom>Are you sure you want to delete the selected Stocks?</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            This action cannot be undone.
                        </Typography>
                    </Box>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteSelectedRows}
                        disabled={deleting} // Disable while deleting
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                }
            />

        </>
    );
}

