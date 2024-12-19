
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
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
import { fIsAfter } from 'src/utils/format-time';
import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
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
import useUserRole from 'src/layouts/components/user-role';
import { Typography } from '@mui/material';
import { applyFilter } from '../utils/filterUtils';
import { ReceivablesTableToolbar } from './receivables-table-toolbar';
import { ReceivablesTableFiltersResult } from './table/receivables-table-filters-result';
import { ReceivablesTableRow } from './table/receivables-table-row';
import { useFetchData } from '../components/fetch-receivable';
import { syncReceivable } from 'src/store/action/accountingActions';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function ReceivablesListView() {
    const table = useTable();
    const confirm = useBoolean();
    const userRole = useUserRole();
    const [selectedRows, setSelectedRows] = useState([]); // Store selected row IDs
    const { fetchData, fetchDeleteData, deleteAllItems } = useFetchData(); // Destructure fetchData from the custom hook
    const dispatch = useDispatch();
    const confirmSync = useBoolean(); // Separate confirmation state for syncing
    const [deleting, setDeleting] = useState(false); // Track delete operation

    const [loading, setLoading] = useState(false);
    const _receivable = useSelector((state) =>
        userRole === 'Admin' ? state.accounting?.receivable || [] : state.accounting?.receivable || []
    );
    const [tableData, setTableData] = useState(_receivable);
    const filters = useSetState({
        name: '',
        status: 'all'
    });
    //-----------------------------------------------------------------------------------------------------
    const TABLE_HEAD = [
        { id: 'customerName', label: 'Customer' },
        { id: 'creditLimit', label: 'Credit Limit' },
        { id: 'closingBalance', label: 'Closing Balance' }, // New column for discount
        { id: 'actions', label: 'Actions' }
    ];


    //----------------------------------------------------------------------------------------------------
    useEffect(() => {
        fetchData(); // Call fetchData when the component mounts
    }, []);

    useEffect(() => {
        setTableData(_receivable);
    }, [_receivable]);
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
    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
        userRole, // Add userRole here
    });

    const canReset =
        !!filters.state.name ||
        filters.state.status !== 'all' ||
        (!!filters.state.startDate && !!filters.state.endDate);

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
    //----------------------------------------------------
    const handleDeleteRow = useCallback((id) => { fetchDeleteData(id) }, []);

    const handleViewRow = useCallback((id) => id, []);

    const handleSyncAPI = async () => {
        setLoading(true); // Set loading to true
        try {
            await dispatch(syncReceivable());
            fetchData(); // Fetch data after syncing
        } catch (error) {
            console.error('Error syncing receivable:', error);
        } finally {
            setLoading(false); // Set loading to false after the API call completes
            confirmSync.onFalse(); // Close the confirmation dialog

        }
    };

    //--------------------------------------------------
    return (
        <div>
            <DashboardContent maxWidth="2xl">
                <CustomBreadcrumbs
                    heading="List"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Receivable'},
                        { name: 'List' },
                    ]}
                    sx={{ mb: { xs: 3, md: 5 } }}

                    action={
                        userRole === 'Admin' && ( // Only show the button for Vendor role
                            <Button
                                onClick={confirmSync.onTrue} // Open the sync confirmation dialog
                                variant="contained"
                                startIcon={<Iconify icon="eva:sync-fill" />}
                                disabled={loading}
                            >
                                {loading ? 'Syncing...' : 'Sync Data'}
                            </Button>
                        )
                    }
                />

                <Card>

                    <ReceivablesTableToolbar
                        filters={filters}
                        onResetPage={table.onResetPage}
    
                        data={tableData}
                    />



                    {canReset && (
                        <ReceivablesTableFiltersResult
                            filters={filters}
                            totalResults={dataFiltered.length}
                            onResetPage={table.onResetPage}
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

                        <Scrollbar sx={{ minHeight: 444 }}>
                            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                                <TableHeadCustom
                                    order={table.order}
                                    orderBy={table.orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={dataFiltered.length}
                                    numSelected={selectedRows.length}

                                    onSort={table.onSort}
                                    onSelectAllRows={(checked) =>
                                        setSelectedRows(checked ? dataFiltered.map((row) => row.id) : [])
                                    }
                                />

                                <TableBody>
                                    {dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row) => (
                                            <ReceivablesTableRow
                                                key={row.id}
                                                row={row}
                                                selected={selectedRows.includes(row.id)}
                                                onSelectRow={() => handleSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                onViewRow={() => handleViewRow(row.id)}
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
                        <Typography gutterBottom>Are you sure you want to sync?</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            This action will update the data and may take a few moments.
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
                title="Delete ledger outstanding statements?"
                content={
                    <Box>
                        <Typography gutterBottom>Are you sure you want to delete the selected Data?</Typography>
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
        </div>
    );
}


