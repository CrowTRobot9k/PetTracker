import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../Theme/AppTheme';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import MuiCard from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(2),
  gap: theme.spacing(1),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('light', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const ConfirmationContainer = styled(Box)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function EmailConfirmation(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [requiresPasswordChange, setRequiresPasswordChange] = React.useState(false);
  const [temporaryPassword, setTemporaryPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);

  React.useEffect(() => {
    const confirmEmail = async () => {
      try {
        const userId = searchParams.get('userId');
        const code = searchParams.get('code');

        if (!userId || !code) {
          setErrorMessage('Invalid confirmation link');
          setIsLoading(false);
          return;
        }

        // Call the confirmEmail API endpoint
        const response = await fetch(`/confirmEmail?userId=${userId}&code=${code}`);

        if (response.ok) {
          // Check if the response indicates password change is required
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (data.requiresPasswordChange) {
              setRequiresPasswordChange(true);
              setIsLoading(false);
              return;
            }
          }
          
          setIsSuccess(true);
          // Redirect to sign in page with success message after a short delay
          setTimeout(() => {
            navigate('/signin?message=activated');
          }, 1000);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Email confirmation failed. Please try again.');
        }
      } catch (error) {
        setErrorMessage('An error occurred while confirming your email. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long');
      return;
    }

    setIsChangingPassword(true);
    setErrorMessage('');

    try {
      const userId = searchParams.get('userId');
      const code = searchParams.get('code');

      const response = await fetch('/confirmEmailWithPasswordChange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          code,
          temporaryPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/signin?message=activated');
        }, 1000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Password change failed. Please check your temporary password and try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while changing your password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ConfirmationContainer>
        <Card variant="outlined">
          <Box 
            component="img"
            src="/PetTrackerLogoWide.png"
            alt="PetTracker Logo"
            sx={{
              width: '100%',
              maxWidth: '400px',
              height: 'auto',
              alignSelf: 'center'
            }}
          />
          
          {isLoading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <CircularProgress />
              <Typography variant="h6" color="text.secondary">
                Confirming your email...
              </Typography>
            </Box>
          )}

          {requiresPasswordChange && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 2 } }}>
              <Typography variant="h6" color="primary" sx={{ textAlign: 'center' }}>
                Password Change Required
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                To complete your email confirmation, please enter the temporary password sent to your email and create a new password.
              </Typography>
              
              <TextField
                label="Temporary Password"
                type="password"
                value={temporaryPassword}
                onChange={(e) => setTemporaryPassword(e.target.value)}
                fullWidth
                required
              />
              
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                required
                helperText="Password must be at least 6 characters long"
              />
              
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
              />
              
              <Button
                variant="contained"
                onClick={handlePasswordChange}
                disabled={isChangingPassword || !temporaryPassword || !newPassword || !confirmPassword}
                fullWidth
                sx={{ mt: { xs: 1, sm: 2 } }}
              >
                {isChangingPassword ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Changing Password...
                  </>
                ) : (
                  'Confirm Email & Change Password'
                )}
              </Button>
              
              {errorMessage && (
                <Alert variant="filled" severity="error">
                  {errorMessage}
                </Alert>
              )}
            </Box>
          )}

          {isSuccess && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 2 } }}>
              <Alert variant="filled" severity="success">
                Email confirmed successfully! Redirecting to sign in...
              </Alert>
            </Box>
          )}

          {!isLoading && !isSuccess && !requiresPasswordChange && errorMessage && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 2 } }}>
              <Alert variant="filled" severity="error">
                {errorMessage}
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                You can try signing up again or contact support if the problem persists.
              </Typography>
            </Box>
          )}
        </Card>
      </ConfirmationContainer>
    </AppTheme>
  );
}







