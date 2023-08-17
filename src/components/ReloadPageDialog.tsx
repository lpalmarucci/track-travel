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
  closeDialog,
}: {
  open: boolean;
  closeDialog(op: boolean): void;
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
        <Button onClick={() => closeDialog(false)}>Cancel</Button>
        <Button onClick={() => closeDialog(true)} autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReloadPageDialog;
