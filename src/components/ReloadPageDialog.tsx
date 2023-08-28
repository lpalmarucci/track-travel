import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

function ReloadPageDialog({
  open,
  onCloseDialog,
  onConfirm = () => {},
  onCancel = () => {},
}: {
  open: boolean;
  onCloseDialog(op: boolean): void;
  onConfirm?(): void;
  onCancel?(): void;
}) {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirm operation</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          In order to proceed you must reload the page
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onCloseDialog(false);
            onCancel();
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onCloseDialog(true);
            onConfirm();
          }}
          autoFocus
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReloadPageDialog;
