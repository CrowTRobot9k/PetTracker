import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import MainContent from '../Components/MainContent';
import Latest from '../Components/Latest';
import Footer from '../Components/Footer';
import AppointmentScheduler from '../Components/AppointmentScheduler.tsx'
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";


export default function Appointments(props: { disableCustomTheme?: boolean }) {
    return (
        <AuthorizeView>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <AppAppBar currentPage="appointments" />
                    <AppointmentScheduler></AppointmentScheduler>
            </AppTheme>
        </AuthorizeView>

    );
}
