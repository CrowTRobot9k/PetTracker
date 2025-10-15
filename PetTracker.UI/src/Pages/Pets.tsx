import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AuthorizeView from "../Components/AuthorizeView.tsx";
import ViewPets from '../Components/Pets/ViewPets.tsx';
import SearchProvider from '../Components/SearchProvider.tsx';
import Container from '@mui/material/Container';

export default function Pets(props: { disableCustomTheme?: boolean }) {

    return (
        <AuthorizeView>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <SearchProvider>
                    <AppAppBar currentPage="pets" />
                    <Container
                        maxWidth="lg"
                        component="main"
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            my: 2, 
                            gap: 2,
                            height: 'calc(100vh - 180px)',
                            minHeight: 0,
                            overflow: 'hidden'
                        }}
                    >
                        <ViewPets />
                    </Container>
                </SearchProvider>
            </AppTheme>
        </AuthorizeView>
    );
}
