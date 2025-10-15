import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
/*import Divider from '@mui/material/Divider';*/
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from '../Components/ForgotPassword';
import AppTheme from '../Theme/AppTheme';
import ColorModeSelect from '../Theme/ColorModeSelect';
/*import { GoogleIcon, FacebookIcon, SitemarkIcon } from '../Components/CustomIcons';*/
import Alert from '@mui/material/Alert';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, useSearchParams } from "react-router";
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import { useAuthStore } from '../Stores/AuthStore';


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

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
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
    ...theme.applyStyles('light', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  const [searchParams] = useSearchParams();
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [submitError, setSubmitError] = React.useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [showActivationMessage, setShowActivationMessage] = React.useState(false);
  const [activationMessageType, setActivationMessageType] = React.useState<'activation' | 'activated' | null>(null);
  const navigate = useNavigate();
  const { login, setLoading, setError } = useAuthStore();

  // Check for activation message on component mount
  React.useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'activation') {
      setShowActivationMessage(true);
      setActivationMessageType('activation');
      // Clear the URL parameter
      navigate('/signin', { replace: true });
    } else if (message === 'activated') {
      setShowActivationMessage(true);
      setActivationMessageType('activated');
      // Clear the URL parameter
      navigate('/signin', { replace: true });
    }
  }, [searchParams, navigate]);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (emailError || passwordError) {
        return;
      }
      const data = new FormData(event.currentTarget);
      const email = data.get('email');
      const password = data.get('password');
      const rememberMe = data.get('remember')

      setSubmitErrorMessage("");
      setLoading(true);
      setError(null);

      let loginurl = "";
      if (rememberMe == 'checked')
          loginurl = "/login?useCookies=true";
      else
          loginurl = "/login?useSessionCookies=true";

      try {
          const response = await fetch(loginurl, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  email: email,
                  password: password,
              }),
          });

          if (response.ok) {
              // Get user data from the response or fetch it
              try {
                  const authResponse = await fetch("/getauth", {
                      method: "GET",
                  });
                  
                  if (authResponse.ok) {
                      const userData = await authResponse.json();
                      const user = {
                          id: userData.id || '',
                          firstName: userData.firstName || '',
                          lastName: userData.lastName || '',
                          fullName: userData.fullName || '',
                          userName: userData.userName || '',
                          email: userData.email || '',
                          company: userData.company || null,
                          roleNames: userData.roleNames || [],
                          roles: userData.roles || []
                      };
                      
                      // Store user in localStorage and update store
                      login(user);
                      navigate('/');
                  } else {
                      throw new Error('Failed to get user data');
                  }
              } catch (error) {
                  console.error('Failed to get user data:', error);
                  // Still redirect but without storing user data
                  navigate('/');
              }
          } else {
              setSubmitError(true);
              setSubmitErrorMessage("Error Logging In.");
          }
      } catch (error) {
          console.log(error);
          setSubmitError(true);
          setSubmitErrorMessage("Error Logging In.");
      } finally {
          setLoading(false);
      }
  };

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const navSignUp = () => {
      navigate("/signup");
  }

  const handleGuestLogin = async () => {
    setEmailError(false);
    setEmailErrorMessage('');
    setPasswordError(false);
    setPasswordErrorMessage('');
    setSubmitErrorMessage("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/login?useSessionCookies=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: 'peter_mathieu@yahoo.com',
          password: 'LISKfYZ7mDLM6d0dwI4@',
        }),
      });

      if (response.ok) {
        // Get user data from the response or fetch it
        try {
          const authResponse = await fetch("/getauth", {
            method: "GET",
          });
          
          if (authResponse.ok) {
            const userData = await authResponse.json();
            const user = {
              id: userData.id || '',
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              fullName: userData.fullName || '',
              userName: userData.userName || '',
              email: userData.email || '',
              company: userData.company || null,
              roleNames: userData.roleNames || [],
              roles: userData.roles || []
            };
            
            login(user);
            navigate("/");
          } else {
            throw new Error("Failed to get user data");
          }
        } catch (error) {
          console.error("Error getting user data:", error);
          setSubmitErrorMessage("Guest login failed. Please try again.");
        }
      } else {
        const errorData = await response.json();
        setSubmitErrorMessage(errorData || 'Guest login failed');
      }
    } catch (error) {
      setSubmitErrorMessage('Guest login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }


  return (
      <AuthorizeView>
      <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        {/*<ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />*/}
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
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: { xs: 'clamp(1.5rem, 8vw, 2rem)', sm: 'clamp(2rem, 10vw, 2.15rem)' } }}
          >
            Sign in
          </Typography>
          {showActivationMessage && (
            <Alert variant="filled" severity="success" sx={{ mb: { xs: 0, sm: 2 } }}>
              {activationMessageType === 'activation' 
                ? 'Account created successfully! Please check your email for an activation link to complete your registration.'
                : 'Your email has been successfully activated! You can now sign in to your account.'
              }
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            name="signInForm"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: { xs: 1, sm: 2 },
            }}
            >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox name="remember" value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="info"
              onClick={validateInputs}
            >
              Sign in
            </Button>
            <Button
                fullWidth
                variant="outlined"
                color="info"
                onClick={navSignUp}
            >
                Sign Up
                          </Button>
                          <Link
                              component="button"
                              type="button"
                              onClick={handleClickOpen}
                              variant="body2"
                              sx={{ alignSelf: 'center' }}
                          >
                              Forgot your password?
                          </Link>
            <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={handleGuestLogin}
                startIcon={<PersonIcon />}
                sx={{ 
                    mt: { xs: 0.5, sm: 2 }, 
                    mb: { xs: 0, sm: 1 },
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    py: { xs: 1, sm: 1.5 },
                    backgroundColor: '#ff9800',
                    boxShadow: '0 4px 8px rgba(255, 152, 0, 0.3)',
                    border: '2px solid #ff9800',
                    '&:hover': {
                        backgroundColor: '#f57c00',
                        boxShadow: '0 6px 12px rgba(255, 152, 0, 0.4)',
                        transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out'
                }}
            >
                Continue as Guest
            </Button>
             {submitError && (
                          <Alert variant="filled" severity="error">
                              {submitErrorMessage}
                          </Alert>
                          )}
            </Box>
          <ForgotPassword open={open} handleClose={handleClose} />
        </Card>
      </SignInContainer>
          </AppTheme>
      </AuthorizeView>
  );
}
