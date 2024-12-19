import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
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
import { useDispatch, useSelector } from 'react-redux';
import { Link } from '@mui/material';

import { PaymentTableToolbar } from './table/payment-table-toolbar';
import { PaymentTableFiltersResult } from './table/payment-table-filter-result';
import { TABLE_ACCOUNT_HEAD } from 'src/components/constants';
import { PaymentTableRow } from './table/payment-table-row';
import { applyFilter } from './utils';
import { useFetchData } from './components/fetch-payment';
import { useForm } from 'react-hook-form';
import { DashboardContent } from 'src/layouts/dashboard';


export function PaymentView() {

    const table = useTable();
    const router = useRouter();
    const confirm = useBoolean();
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]); // Store selected row IDs
    const { fetchData, fetchDeleteData } = useFetchData();
    const dispatch = useDispatch();
    const paymentList = useSelector((state) => state.payment?.payment || []);

    const [tableData, setTableData] = useState(paymentList);

    // Initialize filters state
    const filters = useSetState({ searchTerm: '' });

    useEffect(() => {
        fetchData(); // Fetch banners when the component mounts
    }, []);

    useEffect(() => {
        setTableData(paymentList);
    }, [paymentList]);

    //----------------------------------------------------------------------------------------------------

    const handleSelectRow = useCallback((id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    }, []);

    const handleDeleteSelectedRows = useCallback(() => {
        selectedRows.forEach((id) => fetchDeleteData(id));
        setSelectedRows([]);
        fetchData(); // Refresh data after deletion
        confirm.onFalse();
    }, [selectedRows, fetchDeleteData, fetchData]);

    //----------------------------------------------------------------------------------------------------

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
    });
    const canReset = !!filters.state.searchTerm;
    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;


    const handleDeleteRow = useCallback((id) => { fetchDeleteData(id) }, []);

    const handleEditRow = useCallback((id) => id, []);

    const handleViewRow = useCallback((id) => id, []);


    const { control, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            bankDetails: [
                {
                    bankName: '',
                    accountNumber: '',
                    ifscCode: '',
                    qrCodeImage: null,
                },
            ],
        },
    });

    const bankDetails = watch('bankDetails');

    const handleAddBank = () => {
        setValue('bankDetails', [
            ...bankDetails,
            { bankName: '', accountNumber: '', ifscCode: '', qrCodeImage: null },
        ]);
    };

    const handleRemoveBank = (index) => {
        const updatedDetails = [...bankDetails];
        updatedDetails.splice(index, 1);
        setValue('bankDetails', updatedDetails);
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            console.log('Form Data:', data);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setLoading(false);
            alert('Payment details submitted successfully!');
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            setLoading(false);
        }
    };

    return (
        <DashboardContent maxWidth="2xl">
            <CustomBreadcrumbs
                heading="List"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Payments', href: paths?.dashboard?.payment?.root },
                    { name: 'Payment Details' },
                ]}

                action={
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        <Link
                            component={RouterLink}
                            to="/payments/create"
                            sx={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}
                        >
                            Add Account
                        </Link>
                    </Button>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <Card>
                <PaymentTableToolbar filters={filters} onResetPage={table.onResetPage} />
                {canReset && (
                    <PaymentTableFiltersResult
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
                    <Scrollbar>
                        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                            <TableHeadCustom
                                order={table.order}
                                orderBy={table.orderBy}
                                headLabel={TABLE_ACCOUNT_HEAD}
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
                                    <PaymentTableRow
                                        key={row.id}
                                        row={row}
                                        selected={selectedRows.includes(row.id)}
                                        onSelectRow={() => handleSelectRow(row.id)}
                                        onDeleteRow={() => handleDeleteRow(row.id)}
                                        onEditRow={() => handleEditRow(row.id)}
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
    );
}
