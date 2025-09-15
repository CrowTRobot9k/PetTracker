import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../Theme/AppTheme';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
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

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ConfirmationContainer>
        <Card variant="outlined">
          <img src="/PetTrackerLogoWide.png" width="400" height="120" alt="PetTracker Logo" />
          
          {isLoading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress />
              <Typography variant="h6" color="text.secondary">
                Confirming your email...
              </Typography>
            </Box>
          )}

          {isSuccess && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Alert variant="filled" severity="success">
                Email confirmed successfully! Redirecting to sign in...
              </Alert>
            </Box>
          )}

          {!isLoading && !isSuccess && errorMessage && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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





