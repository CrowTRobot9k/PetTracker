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
import { useNavigate } from "react-router";
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";


const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(2),
  gap: theme.spacing(1.5),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
    gap: theme.spacing(2),
    maxWidth: '450px',
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
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
  padding: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.up('md')]: {
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
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [submitError, setSubmitError] = React.useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (emailError || passwordError) {
        return;
      }
      const data = new FormData(event.currentTarget);
      const email = data.get('email');
      const password = data.get('password');
      const rememberMe = data.get('remember')

      setSubmitErrorMessage("");

      let loginurl = "";
      if (rememberMe == 'checked')
          loginurl = "/login?useCookies=true";
      else
          loginurl = "/login?useSessionCookies=true";

      fetch(loginurl, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              email: email,
              password: password,
          }),
      }).then((data) => {
          if (data.ok) {
              window.location.href = '/';
          }
          else {
              setSubmitError(true);
              setSubmitErrorMessage("Error Logging In.");
          }
      }).catch((error) => {
              console.log(error);
          setSubmitError(true);
          setSubmitErrorMessage("Error Logging In.");
      });
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


  return (
      <AuthorizeView>
      <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Box
            component="img"
            src="/PetTrackerLogoWide.png"
            sx={{
              width: '100%',
              height: 'auto',
              maxWidth: { xs: '300px', sm: '350px', md: '400px' },
              maxHeight: { xs: '90px', sm: '105px', md: '120px' },
              alignSelf: 'center',
              objectFit: 'contain'
            }}
            alt="PetTracker Logo"
          />
          <Typography
            component="h1"
            variant="h4"
            sx={{ 
              width: '100%', 
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            name="signInForm"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
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
              onClick={validateInputs}
              size="large"
              sx={{ 
                py: 1.5,
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              Sign in
            </Button>
            <Button
                fullWidth
                variant="outlined"
                onClick={navSignUp}
                size="large"
                sx={{ 
                  py: 1.5,
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                }}
            >
                Sign Up
            </Button>
             {submitError && (
                          <Alert variant="filled" severity="error">
                              {submitErrorMessage}
                          </Alert>
                          )}
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Forgot your password?
            </Link>
            </Box>
          <ForgotPassword open={open} handleClose={handleClose} />
        </Card>
      </SignInContainer>
          </AppTheme>
      </AuthorizeView>
  );
}
