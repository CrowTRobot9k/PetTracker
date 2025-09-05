import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AuthorizeView from "../Components/AuthorizeView.tsx";
import ViewOwners from '../Components/Owners/ViewOwners.tsx';
import SearchProvider from '../Components/SearchProvider.tsx';
import { Container } from '@mui/material';

export default function Owners(props: { disableCustomTheme?: boolean }) {
    return (
        <AuthorizeView>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <SearchProvider>
                    <AppAppBar currentPage="owners" />
                    <Container
                        maxWidth="lg"
                        component="main"
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            my: 2, 
                            gap: 2
                        }}
                    >
                        <ViewOwners />
                    </Container>
                </SearchProvider>
            </AppTheme>
        </AuthorizeView>

    );
}
