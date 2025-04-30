import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AddressForm from '../Components/AddressForm';
import Info from '../Components/Info';
import InfoMobile from '../Components/InfoMobile';
import PaymentForm from '../Components/PaymentForm';
import Review from '../Components/Review';
import SitemarkIcon from '../Components/SitemarkIcon';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AddIcon from '@mui/icons-material/Add';
import AddPet from '../Components/AddPet';
import Container from '@mui/material/Container';
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";



//import ColorModeIconDropdown from '../Theme/ColorModeIconDropdown';

const steps = ['Shipping address', 'Payment details', 'Review your order'];
function getStepContent(step: number) {
    switch (step) {
        case 0:
            return <AddressForm />;
        case 1:
            return <PaymentForm />;
        case 2:
            return <Review />;
        default:
            throw new Error('Unknown step');
    }
}
export default function Pets(props: { disableCustomTheme?: boolean }) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };
    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
       /* <AuthorizeView>*/
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppAppBar currentPage="pets" />
            <Container
                maxWidth="lg"
                component="main"
                sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
            >
                <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                    <div>
                        <Button onClick={handleClickOpen} variant="contained" color="info" endIcon={<AddIcon />}>
                            Add Pet
                        </Button>
                    </div>
                </Box>
                <AddPet open={open} setOpen={ setOpen } handleClose={handleClose} />
            </Container>
            </AppTheme>
       /* </AuthorizeView>*/
    );
}
