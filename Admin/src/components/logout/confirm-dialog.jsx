import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

export default function ConfirmDialog({ open, onClose, onConfirm, title, content }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: '#f0f4f8',  // Light background color for the dialog

        }
      }}
    >
      <DialogTitle sx={{ backgroundColor: '#3f51b5', color: 'white' }}>
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: '#e3f2fd',  // Light blue background for the content
          color: '#333',
          padding: '20px',
        }}
      >
        <p>{content}</p>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: '#f5f5f5',
          padding: '10px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={onClose} color="secondary" sx={{ backgroundColor: '#f44336', color: 'white', '&:hover': { backgroundColor: '#d32f2f' } }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" sx={{ backgroundColor: '#4caf50', color: 'white', '&:hover': { backgroundColor: '#388e3c' } }}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
