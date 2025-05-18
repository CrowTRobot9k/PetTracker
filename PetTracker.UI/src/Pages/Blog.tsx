import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import BlogContent from '../Components/BlogContent';
import Latest from '../Components/Latest';
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";


export default function Blog(props: { disableCustomTheme?: boolean }) {
    return (
        <AuthorizeView>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <AppAppBar/>
                <Container
                maxWidth="xl"
                component="main"
                    sx={{
                       display: 'flex',
                       flexDirection: 'column', my: 2, gap: 4,

                    }}
                >
                <BlogContent />
                </Container>
            </AppTheme>
        </AuthorizeView>

  );
}
