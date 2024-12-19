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
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
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

import { UserTableRow } from '../user-table-row';
import { UserTableToolbar } from '../user-table-toolbar';
import { UserTableFiltersResult } from '../user-table-filters-result';
import { useDispatch, useSelector } from 'react-redux';
import { userList } from 'src/store/action/userActions';
import { Typography } from '@mui/material';
import { UserForm } from './user-form'; // This will be the shared form for both add and edit
import { getStatusOptions, TABLE_HEAD } from '../../../components/constants';
import { applyFilter } from '../utils';
import { useFetchUserData } from '../components';

export const _roles = [
  `Admin`,
  `Customer`,
  `Vendor`
];

// ----------------------------------------------------------------------
export function UserListView() {
  const table = useTable();
  const router = useRouter();
  const confirm = useBoolean();
  const dispatch = useDispatch();

  const { fetchData, fetchDeleteData } = useFetchUserData(); // Destructure fetchData from the custom hook

  const _userList = useSelector((state) => state.user?.user || []);
  const [tableData, setTableData] = useState(_userList);
  const [selectedUser, setSelectedUser] = useState(null); // Store selected user for editing

  const STATUS_OPTIONS = getStatusOptions(tableData);

  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => { 
    setSelectedUser(null); // Clear selected user when adding a new one
    setOpenDialog(true); 
  };
  const handleCloseDialog = () => { setOpenDialog(false) };

  // Update the initial state to include lastName, email, and mobile
  const filters = useSetState({ firstName: '', lastName: '', role: [], email: '', mobile: '', status: 'all' });

  //----------------------------------------------------------------------------------------------------
  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, []);

  useEffect(() => {
    setTableData(_userList);
  }, [_userList]);

  //----------------------------------------------------------------------------------------------------

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const canReset = !!filters.state.searchTerm || filters.state.role.length > 0 || filters.state.status !== 'all';
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  //----------------------------------------------------------------------------------------------------

  const handleDeleteRows = useCallback((id) => { fetchDeleteData(id) }, []);

  const handleDeleteRow = useCallback((id) => { fetchDeleteData(id) }, []);

  const handleEditRow = useCallback((id) => {
    const user = _userList.find((u) => u.id === id);
    setSelectedUser(user); // Set the selected user for editing
    setOpenDialog(true); // Open the dialog for editing
  }, [_userList]);

  const handleViewRow = useCallback((id) => id, []);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );
  //----------------------------------------------------------------------------------------------------

  return (
    <>
      <DashboardContent maxWidth="2xl">
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Users', href: paths?.dashboard?.user?.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              onClick={handleOpenDialog} // Open the dialog on click for creating a new user
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New user
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <UserForm open={openDialog} onClose={handleCloseDialog} userData={selectedUser} /> {/* Use unified form */}
        <Card>
          <Tabs value={filters.state.status} onChange={handleFilterStatus}
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
                    variant={tab.value === filters.state.status ? 'filled' : 'soft'}
                    color={
                      (tab.value === 'Active' && 'success') ||
                      (tab.value === 'Suspended' && 'error') ||
                      (tab.value === 'all' && 'default') || 'default'
                    }
                  >
                    {tab.count} {/* Display the count for each status */}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <UserTableToolbar filters={filters} onResetPage={table.onResetPage} options={{ roles: _roles }}  tableData={tableData}/>
          
          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
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
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered.slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  ).map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)} // Edit user action
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete users?"
        content={
          <Box>
            <Typography gutterBottom>Are you sure you want to delete the selected users?</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              This action cannot be undone.
            </Typography>
          </Box>
        }
        action={
          <Button onClick={handleDeleteRows} variant="contained" color="error">
            Delete
          </Button>
        }
      />
    </>
  );
}
