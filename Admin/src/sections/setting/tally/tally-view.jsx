import { useEffect, useState } from "react";
import {
    Box, Card, CardContent, Typography, Button, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, Grid, Snackbar
} from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { paths } from "src/routes/paths";
import { fetchTallyAPIData, updateTallyAPI } from "src/store/action/settingActions";
import { useDispatch, useSelector } from "react-redux";

export function TallyView() {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.setting.tallyFetchData || []); // Replace with your state path
    const [ledgerData, setLedgerData] = useState(data);
    const [selectedLedger, setSelectedLedger] = useState(null); // Tracks the ledger being edited
    const [dialogOpen, setDialogOpen] = useState(false); // Dialog visibility state
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });


    const fetchData = async () => {
        const success = await dispatch(fetchTallyAPIData());
        if (!success) {
            setSnackbar({ open: true, message: "Failed to load ledger data.", severity: "error" });
        }
    };
    // Fetch ledger data on component mount
    useEffect(() => {

        fetchData();
    }, [dispatch]);

    // Synchronize local state with Redux store
    useEffect(() => {
        setLedgerData(data);
    }, [data]);

    // Open the dialog with the selected ledger
    const handleEdit = (ledger) => {
        setSelectedLedger(ledger);
        setDialogOpen(true);
    };

    // Close dialog
    const closeDialog = () => {
        setDialogOpen(false);
        setSelectedLedger(null);
    };

    // Save the updated ledger
    const handleSave = async () => {
        if (selectedLedger) {
            const success = await dispatch(updateTallyAPI(selectedLedger.id, selectedLedger));
            if (success) {
                setLedgerData((prevData) =>
                    prevData.map((ledger) =>
                        ledger.id === selectedLedger.id ? selectedLedger : ledger
                    )
                );
                fetchData()
                setSnackbar({ open: true, message: "Data updated successfully.", severity: "success" });
            } else {
                setSnackbar({ open: true, message: "Failed to update ledger.", severity: "error" });
            }
            closeDialog();
        }
    };

    return (
        <DashboardContent maxWidth="2xl" sx={{ backgroundColor: "#f0f3f5", padding: "20px" }}>
            <CustomBreadcrumbs
                heading="Tally Settings"
                links={[
                    { name: "Dashboard", href: paths.dashboard.root },
                    { name: "Tally Settings", href: paths?.settings.tally },
                ]}
            />

            <Box sx={{ marginTop: 4 }}>
                <Grid container spacing={2}>
                    {ledgerData
                        .slice() // Create a copy of the array to avoid mutating the original state
                        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Sort by createdAt in ascending order 
                        .map((ledger) => (

                            <Grid item xs={12} sm={6} key={ledger.id}>
                                <Card
                                    sx={{
                                        backgroundColor: "#eaf4f1",
                                        border: "1px solid #007b5e",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleEdit(ledger)}
                                >
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: "bold",
                                                color: "#007b5e",
                                            }}
                                        >
                                            {ledger.name}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: "#333",
                                                marginTop: "10px",
                                            }}
                                        >
                                            {ledger.value || "Not Set"}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
            </Box>

            {/* Dialog for Editing */}
            {selectedLedger && (
                <Dialog
                    open={dialogOpen}
                    onClose={closeDialog}
                    fullWidth
                    maxWidth="sm"
                    sx={{
                        "& .MuiDialog-paper": {
                            backgroundColor: "#eaf4f1",
                            border: "2px solid #007b5e",
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            backgroundColor: "#007b5e",
                            color: "#fff",
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                    >
                        Edit {selectedLedger.name}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Ledger Value"
                            value={selectedLedger.value || ""}
                            onChange={(e) =>
                                setSelectedLedger({ ...selectedLedger, value: e.target.value })
                            }
                            sx={{
                                marginTop: 2,
                                "& .MuiInputBase-root": {
                                    backgroundColor: "#fff",
                                },
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={closeDialog}
                            sx={{
                                color: "#007b5e",
                                fontWeight: "bold",
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            sx={{
                                backgroundColor: "#007b5e",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "#005945",
                                },
                            }}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Snackbar for Notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
            />
        </DashboardContent>
    );
}
