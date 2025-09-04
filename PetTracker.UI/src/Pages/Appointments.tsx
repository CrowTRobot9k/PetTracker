import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AppointmentScheduler from '../Components/AppointmentScheduler.tsx'
import AuthorizeView from "../Components/AuthorizeView.tsx";
import SearchProvider from '../Components/SearchProvider.tsx';
import Container from '@mui/material/Container';

export default function Appointments(props: { disableCustomTheme?: boolean }) {
    return (
        <AuthorizeView>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <SearchProvider>
                    <AppAppBar currentPage="appointments" />
                    <Container
                        maxWidth="xl"
                        component="main"
                        sx={{ display: 'flex', flexDirection: 'column', my: 2, gap: 2 }}
                    >
                        <AppointmentScheduler />
                    </Container>
                </SearchProvider>
            </AppTheme>
        </AuthorizeView>
    );
}
