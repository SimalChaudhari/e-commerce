import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Switch,
    FormControlLabel,
    Paper,
    Grid,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { paths } from "src/routes/paths";
import { useDispatch, useSelector } from "react-redux";
import { editSyncSetting, syncSettingList } from "src/store/action/settingActions";

export function SyncView() {
    const dispatch = useDispatch();

    const syncs = useSelector((state) => state.setting?.syncData || []);

    // States to manage confirmation dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);

    // Fetch sync settings from the backend
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(syncSettingList());
        };
        fetchData();
    }, [dispatch]);

    // API call to update sync settings
    const updateSyncSetting = async (id, moduleName, isAutoSyncEnabled, isManualSyncEnabled) => {
        try {
            // Dispatch the action to update the sync setting
            const success = await dispatch(
                editSyncSetting(id, {
                    moduleName,
                    isAutoSyncEnabled,
                    isManualSyncEnabled,
                })
            );
            if (success) {
                console.log(`Sync setting for ${moduleName} updated successfully.`);
            } else {
                console.error(`Failed to update sync setting for ${moduleName}.`);
            }
        } catch (error) {
            console.error("Failed to update sync setting:", error);
        }
    };

    // Handle toggle with confirmation dialog
    const handleToggle = (id, moduleName, setStateFunction, currentState, syncType) => {
        setDialogOpen(true);
        setCurrentAction(() => async () => {
            const updatedState = !currentState;

            // Update the local state
            setStateFunction(updatedState);

            // Update API
            const updatedSyncs = {
                isAutoSyncEnabled: syncType === "Auto Sync" ? updatedState : undefined,
                isManualSyncEnabled: syncType === "Manual Sync" ? updatedState : undefined,
            };
            await updateSyncSetting(id, moduleName, updatedSyncs.isAutoSyncEnabled, updatedSyncs.isManualSyncEnabled);

            setDialogOpen(false);
        });
    };

    // Render individual sync cards dynamically
    const renderSyncCard = (sync) => (
        <Paper key={sync.id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>{sync.moduleName}</Typography>
            <Divider />
            <Box sx={{ mt: 2 }}>
                <Typography>Auto Sync</Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={sync.isAutoSyncEnabled}
                            onChange={() =>
                                handleToggle(sync.id, sync.moduleName, (state) => {
                                    sync.isAutoSyncEnabled = state;
                                }, sync.isAutoSyncEnabled, "Auto Sync")
                            }
                            color="primary"
                        />
                    }
                    label={sync.isAutoSyncEnabled ? "Enabled" : "Disabled"}
                />
            </Box>
            <Box sx={{ mt: 2 }}>
                <Typography>Manual Sync</Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={sync.isManualSyncEnabled}
                            onChange={() =>
                                handleToggle(sync.id, sync.moduleName, (state) => {
                                    sync.isManualSyncEnabled = state;
                                }, sync.isManualSyncEnabled, "Manual Sync")
                            }
                            color="primary"
                        />
                    }
                    label={sync.isManualSyncEnabled ? "Enabled" : "Disabled"}
                />
            </Box>
        </Paper>
    );

    return (
        <DashboardContent maxWidth="2xl">
            <CustomBreadcrumbs
                heading="Sync Settings"
                links={[
                    { name: "Dashboard", href: paths.dashboard.root },
                    { name: "Sync Settings", href: paths?.settings.sync },
                ]}
            />

            <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2, fontWeight: 'bold' }}>
                    Note:
                </Typography>
                <Box
                    component="ul"
                    sx={{
                        pl: 4, // Padding for bullet indentation
                        mt: 1,
                        '& li': {
                            listStyleType: 'disc', // Ensures bullet points are shown
                            marginLeft: '1rem', // Adjust margin for bullet alignment
                        },
                    }}
                >
                    <li>
                        <Typography variant="body2" color="textSecondary">
                            Auto Sync, when enabled, syncs data automatically every hour.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body2" color="textSecondary">
                            Manual Sync allows you to sync data on-demand at any time.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body2" color="textSecondary">
                            Disabling either option stops its respective functionality.
                        </Typography>
                    </li>
                </Box>
            </Box>
            <Box>
                <Grid container spacing={2}>
                    {syncs
                        .slice() // Create a copy of the array to avoid mutating the original state
                        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Sort by createdAt in ascending order
                        .map((sync) => (
                            <Grid key={sync.id} item xs={12} sm={6} md={4}>
                                {renderSyncCard(sync)}
                            </Grid>
                        ))}
                </Grid>
            </Box>



            {/* Confirmation Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to change this sync setting?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={currentAction} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </DashboardContent>
    );
}
