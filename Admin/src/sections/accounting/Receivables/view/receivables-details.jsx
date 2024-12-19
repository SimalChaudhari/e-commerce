import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { Scrollbar } from 'src/components/scrollbar';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { useFetchData } from '../components/fetch-receivable';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { writeFile, utils } from 'xlsx';
import { generatePDF } from '../utils/generatePDF';

export function ReceivablesListDetails() {
    const { fetchByIdData } = useFetchData();
    const { id } = useParams();
    const receivable = useSelector((state) => state.accounting?.getByReceivable || []);
    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');

    // Filtered data
    const filteredBills = receivable?.bills?.filter((bill) =>
        Object.values(bill).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  

    useEffect(() => {
        fetchByIdData(id);
    }, []);

    const handleDownloadPdf = () => {
        if (!filteredBills || filteredBills.length === 0) {
            console.error('No data available for download.');
            return;
        }
        // Call the generatePDF function to generate and download the PDF
        generatePDF(filteredBills, receivable.customerName);
    }

    // const handleExportData = () => {
    //     if (!filteredBills?.length) {
    //         alert('No data available for export.');
    //         return;
    //     }

    //     const data = filteredBills.map((row, index) => ({
    //         '#No': index + 1,
    //         'Tally Invoice No': row.tallyInvNo,
    //         'Tally Order ID': row.tallyOrdId || '-',
    //         'NX Order ID': row.nxOrderId || '-',
    //         'Opening Balance': fCurrency(row.openingBalance) || '-',
    //         'Closing Balance': fCurrency(row.closingBalance) || '-',
    //         'Credit Period': row.creditPeriod || '-',
    //         'Bill Date': fDate(row.billDate),
    //     }));

    //     const worksheet = utils.json_to_sheet(data);
    //     const workbook = utils.book_new();
    //     utils.book_append_sheet(workbook, worksheet, 'Receivables');

    //     writeFile(workbook, `Receivables_${id}.xlsx`);
    // };

    // Handle pagination changes
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page
    };

    const renderFooter = (
        <Box gap={2} display="flex" alignItems="center" flexWrap="wrap" sx={{ py: 3 }}>
            <div>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    NOTES : -
                </Typography>
                <Typography variant="body2">
                    Outstanding receivables are updated automatically every 24 hours through auto-sync.
                </Typography>
            </div>
        </Box>
    );

    const renderList = (
        <Scrollbar sx={{ mt: 5 }}>
            <Table sx={{ minWidth: 960 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Tally Invoice No</TableCell>
                        <TableCell>Tally Order ID</TableCell>
                        <TableCell>NX Order ID</TableCell>
                        <TableCell align="center">Opening Balance</TableCell>
                        <TableCell align="center">Closing Balance</TableCell>
                        <TableCell align="center">Credit Period</TableCell>
                        <TableCell align="center">Bill Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredBills?.length > 0 ? (
                        filteredBills
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Apply pagination
                            .map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{row.tallyInvNo}</TableCell>
                                    <TableCell>{row.tallyOrdId || '-'}</TableCell>
                                    <TableCell>{row.nxOrderId || '-'}</TableCell>
                                    <TableCell align="center">{fCurrency(row.openingBalance) || '-'}</TableCell>
                                    <TableCell align="center">{fCurrency(row.closingBalance) || '-'}</TableCell>
                                    <TableCell align="center">{row.creditPeriod || '-'}</TableCell>
                                    <TableCell align="center">{fDate(row.billDate) || '-'}</TableCell>
                                </TableRow>
                            ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                <Typography variant="body2" color="text.secondary">
                                    No bills available.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Scrollbar>
    );

    return (
        <DashboardContent maxWidth="2xl">
            <CustomBreadcrumbs
                heading={`View # ${receivable.customerName}`}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Receivable', href: paths?.accounts?.receivable },
                    { name: 'View' },
                ]}
                action={
                    <Button variant="contained" onClick={handleDownloadPdf}>
                        Download
                    </Button>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Card sx={{ pt: 5, px: 5 }}>
                <Box
                    rowGap={3}
                    display="grid"
                    alignItems="center"
                    gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
                >
                    <Stack sx={{ typography: 'body2' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Customer Name
                        </Typography>
                        {receivable.customerName}
                    </Stack>

                    <Stack sx={{ typography: 'body2' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Credit Limit
                        </Typography>
                        {fCurrency(receivable.creditLimit)}
                    </Stack>

                    <Stack sx={{ typography: 'body2' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Closing Balance
                        </Typography>
                        {fCurrency(receivable.closingBalance)}
                    </Stack>
                </Box>
                <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

                <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 2, mt: 2 }}
                />

                {renderList}

                <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

                <TablePagination
                    component="div"
                    count={filteredBills?.length || 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                {renderFooter}
            </Card>
        </DashboardContent>
    );
}
