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

import { LogTableRow } from './table/log-table-row';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchOrderData } from '../components/fetch-logs';
import useUserRole from 'src/layouts/components/user-role';
import { syncOrder } from 'src/store/action/orderActions';
import { Typography } from '@mui/material';
import { applyFilter } from '../utils/filterUtils';
import { LogTableFiltersResult } from './table/log-table-filters-result';

// ----------------------------------------------------------------------
const TABLE_HEAD = [

    { id: 'sync_type', label: 'SyncType' },
    { id: 'created_at', label: 'Log Sync Date' },
    { id: 'status', label: 'Status' }
];
const STATUS_COLORS = {
    success: 'success',
    fail: 'error',
    stocks: 'warning',
    products: 'error',
    orders: 'info',
    vendors: 'primary',
    ledger: 'secondary',
    receivable: 'default',
    default: 'default',
};
export const LOGS_STATUS_OPTIONS = [
    { value: 'stocks', label: 'Stocks' },
    { value: 'items', label: 'Products' },
    { value: 'orders', label: 'Orders' },
    { value: 'vendors', label: 'Vendors' },
    { value: 'ledger', label: 'Ledger' },
    { value: 'receivable', label: 'Receivable' },
    { value: 'success', label: 'Success' },
    { value: 'fail', label: 'Fails' },

];

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...LOGS_STATUS_OPTIONS];

// ----------------------------------------------------------------------


export function LogListView() {
    const table = useTable();
    const confirm = useBoolean();
    const userRole = useUserRole();
    const [selectedRows, setSelectedRows] = useState([]); // Store selected row IDs
    const { fetchData } = useFetchOrderData(); // Destructure fetchData from the custom hook
    const dispatch = useDispatch();
    const confirmSync = useBoolean(); // Separate confirmation state for syncing
    const [loading, setLoading] = useState(false);
    const _logs = useSelector((state) => state.logs?.logs);
    const [tableData, setTableData] = useState(_logs);
    const filters = useSetState({
        status: 'all',
        sync_type: ''
    });

    //----------------------------------------------------------------------------------------------------
    useEffect(() => {
        fetchData(); // Call fetchData when the component mounts
    }, []);

    useEffect(() => {
        setTableData(_logs);
    }, [_logs]);
    //----------------------------------------------------------------------------------------------------

    const handleSelectRow = useCallback((id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    }, []);

    const dataFiltered = tableData
    .filter((item) =>
      filters.state.sync_type === 'all' || filters.state.status === 'all'
        ? true
        : (filters.state.sync_type && item.sync_type === filters.state.sync_type) ||
          (filters.state.status && item.status === filters.state.status)
    )
    .sort(getComparator(table.order, table.orderBy)); // Apply the sorting comparator after filtering
  
    //----------------------------------------------------------------------------------------------------

    const canReset =
        !!filters.state.name ||
        filters.state.status !== 'all' ||
        (!!filters.state.startDate && !!filters.state.endDate);

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
    //----------------------------------------------------

    const handleFilterStatus = useCallback(
        (event, newValue) => {
            table.onResetPage();
            // Dynamically update either `sync_type` or `status` based on the tab value
            if (newValue === 'all') {
                filters.setState({ sync_type: newValue, status: 'all' });
            } else if (LOGS_STATUS_OPTIONS.some((option) => option.value === newValue)) {
                filters.setState({ sync_type: newValue, status: newValue });
            } else {
                filters.setState({ sync_type: newValue, status: newValue });
            }
        },
        [filters, table]
    );


    const handleSyncAPI = async () => {
        setLoading(true); // Set loading to true
        try {
            await dispatch(syncOrder());
            fetchData(); // Fetch data after syncing
        } catch (error) {
            console.error('Error syncing order invoice:', error);
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
                        { name: 'Orders', href: paths?.dashboard?.order?.root },
                        { name: 'List' },
                    ]}
                    sx={{ mb: { xs: 3, md: 5 } }}
                />
                <Card>
                    <Tabs
                        value={filters.state.status}
                        onChange={handleFilterStatus}
                        sx={{
                            px: 2.5,
                            boxShadow: (theme) =>
                                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
                        }}
                    >
                        {STATUS_OPTIONS.map((tab) => (
                            <Tab
                                key={tab.value}
                                iconPosition="end"
                                value={tab.value}
                                label={tab.label}
                                icon={
                                    <Label
                                        variant={
                                            tab.value === 'all' || tab.value === filters.state.status
                                                ? 'filled'
                                                : 'soft'
                                        }
                                        color={STATUS_COLORS[tab.value] || STATUS_COLORS.default}
                                    >
                                        {LOGS_STATUS_OPTIONS.some((statusOption) => statusOption.value === tab.value)
                                            ? tableData.filter(
                                                (user) =>
                                                    user.sync_type === tab.value || user.status === tab.value
                                            ).length
                                            : tableData.length}
                                    </Label>
                                }
                            />
                        ))}

                    </Tabs>

                    {canReset && (
                        <LogTableFiltersResult
                            filters={filters}
                            totalResults={dataFiltered.length}
                            onResetPage={table.onResetPage}
                            sx={{ p: 2.5, pt: 0 }}
                        />
                    )}



                    <Box sx={{ position: 'relative' }} mt={3}>
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
                                            <LogTableRow
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
                        <Typography gutterBottom>Are you sure you want to sync the Invoices?</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            This action will update the Invoices data and may take a few moments.
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


