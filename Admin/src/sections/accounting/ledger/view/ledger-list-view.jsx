
import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
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
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
    useTable,
    emptyRows,
    TableNoData,
    getComparator,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table';

import { LedgerTableRow } from './table/ledger-table-row';
import { useDispatch, useSelector } from 'react-redux';
import useUserRole from 'src/layouts/components/user-role';
import { Autocomplete, TextField, Typography } from '@mui/material';
import { applyFilter } from '../utils/filterUtils';
import { LedgerTableToolbar } from './ledger-table-toolbar';
import { useFetchData } from '../components/fetch-ledger';
import { LedgerTableFiltersResult } from './table/ledger-table-filters-result';
import { syncLedger } from 'src/store/action/accountingActions';
// ----------------------------------------------------------------------

export function LedgerListView() {
    const table = useTable();
    const confirm = useBoolean();
    const userRole = useUserRole();
    const [selectedRows, setSelectedRows] = useState([]); // Store selected row IDs
    const { fetchData } = useFetchData(); // Destructure fetchData from the custom hook

    const dispatch = useDispatch();
    const confirmSync = useBoolean(); // Separate confirmation state for syncing

    const [loading, setLoading] = useState(false);
    const _ledger = useSelector((state) => state.accounting?.ledger);
 
     const [selectedParty, setSelectedParty] = useState(null); // Selected party
 
    const [tableData, setTableData] = useState(_ledger);

    const filters = useSetState({
        party: "",
        name: '',
        startDate: null,
        endDate: null,
    });

    const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);
    //-----------------------------------------------------------------------------------------------------

    const TABLE_HEAD = [
        { id: 'party', label: 'Party' },
        { id: 'alias', label: 'Alias', align: 'center' },
        { id: 'openingBalance', label: 'Opening Balance',align: 'center' },
        { id: 'closingBalance', label: 'Closing Balance' ,align: 'center'},
        { id: 'totalDebitAmount', label: 'Total Debit Amount',align: 'center' },
        { id: 'totalCreditAmount', label: 'Total Credit Amount',align: 'center' },
        { id: 'actions', label: 'Actions' }

    ];


    //----------------------------------------------------------------------------------------------------
    useEffect(() => {
        fetchData(); // Call fetchData when the component mounts
    }, []);

    useEffect(() => {
        setTableData(_ledger);
    }, [_ledger]);
    //----------------------------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------------------------
    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
        dateError,
        userRole, // Add userRole here
    });

    const canReset =
        !!filters.state.name ||
        (!!filters.state.startDate && !!filters.state.endDate);

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
    //----------------------------------------------------

    const handleViewRow = useCallback((id) => id, []);



    const handleSyncAPI = async () => {
        setLoading(true); // Set loading to true
        try {
            await dispatch(syncLedger());
            fetchData(); // Fetch data after syncing
        } catch (error) {
            console.error('Error syncing order invoice:', error);
        } finally {
            setLoading(false); // Set loading to false after the API call completes
            confirmSync.onFalse(); // Close the confirmation dialog

        }
    };

    //---------------------------------------------------------
    return (
        <div>
            <DashboardContent maxWidth="2xl">
                <CustomBreadcrumbs
                    heading="List"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Orders', href: paths?.dashboard?.order?.root },
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

                    <LedgerTableToolbar
                        filters={filters}
                        onResetPage={table.onResetPage}
                        dateError={dateError}
                        data={tableData}
                    />


                    {canReset && (
                        <LedgerTableFiltersResult
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
                                            <LedgerTableRow
                                                key={row.id}
                                                row={row}
                                                selected={selectedRows.includes(row.id)}

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

        </div>
    );
}


