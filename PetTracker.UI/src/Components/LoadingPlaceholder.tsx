import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingPlaceholder() {

    return (
        <Container
            maxWidth="xl"
            component="main"
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                my: 2,
                gap: 4
            }}
        >
            <Grid container spacing={2} columns={12}
                sx={{
                    width: '2000px',
                    height: 700,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress />
            </Grid>
        </Container>
    );
}