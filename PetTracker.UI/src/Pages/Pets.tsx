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
                            height: { 
                                xs: 'calc(100vh - 200px)', 
                                sm: 'calc(100vh - 210px)', 
                                md: 'calc(100vh - 220px)', 
                                lg: 'calc(100vh - 230px)', 
                                xl: 'calc(100vh - 245px)' 
                            },
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
