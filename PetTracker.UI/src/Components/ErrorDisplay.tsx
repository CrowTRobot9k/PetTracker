import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function ErrorDisplay({ error, height}: { error: string, height:number }) {

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
                    height: { height},
                }}
            >
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert variant="filled" severity="error">
                        {error}
                    </Alert>
                </Stack>
            </Grid>
        </Container>
    );
}