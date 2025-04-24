import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import Alert from '@mui/material/Alert';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps)
{
    const [submitSuccessMessage, setSuccessMessage] = React.useState('');
    const [submitErrorMessage, setErrorMessage] = React.useState('');

    const handleForgotSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");


        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        fetch("/forgotPassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
            }),
        }).then((data) => {
            if (data.ok) {
                setSuccessMessage("Password Reset Email Sent")
            }
            else {
                setErrorMessage("Error Sending Password Reset");
            }
        }).catch((error) => {
            console.log(error);
            setErrorMessage("Error Sending Password Reset");
        });
    }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      >
      <form name="forgotPasswordForm" onSubmit={handleForgotSubmit}>
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a link to
          reset your password.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Email address"
          placeholder="Email address"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">Continue</Button>
      </DialogActions>
      {submitSuccessMessage?.length > 0 && (
          <Alert variant="filled" severity="success">
              {submitSuccessMessage}
          </Alert>
      )}
      {submitErrorMessage?.length > 0 && (
          <Alert variant="filled" severity="error">
              {submitErrorMessage}
          </Alert>
      )}
      </form>
    </Dialog>
  );
}
