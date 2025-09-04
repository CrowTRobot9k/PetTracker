import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import BlogContent from '../Components/BlogContent.tsx';
import Latest from '../Components/Latest';
import Footer from '../Components/Footer';
import AuthorizeView from "../Components/AuthorizeView.tsx";
import SearchProvider from '../Components/SearchProvider.tsx';

export default function Blog(props: { disableCustomTheme?: boolean }) {
    return (
        <AuthorizeView>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <SearchProvider>
                    <AppAppBar currentPage="blog" />
                    <Container
                        maxWidth="lg"
                        component="main"
                        sx={{ display: 'flex', flexDirection: 'column', my: 4, gap: 4 }}
                    >
                        <BlogContent />
                        <Latest />
                    </Container>
                </SearchProvider>
                <Footer />
            </AppTheme>
        </AuthorizeView>
    );
}
