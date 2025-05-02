import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AddIcon from '@mui/icons-material/Add';
import AddPet from '../Components/AddPet';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { styled } from '@mui/material/styles';
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import useSharedStore from '../Stores/SharedStore';


export default function Pets(props: { disableCustomTheme?: boolean }) {
    const getPets = useSharedStore((state) => state.getPets);
    const { pets, loadingPets } = useSharedStore();
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        getPets();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const SyledCard = styled(Card)(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        height: '100%',
        backgroundColor: (theme.vars || theme).palette.background.paper,
        '&:hover': {
            backgroundColor: 'transparent',
            cursor: 'pointer',
        },
        '&:focus-visible': {
            outline: '3px solid',
            outlineColor: 'hsla(210, 98%, 48%, 0.5)',
            outlineOffset: '2px',
        },
    }));

    const SyledCardContent = styled(CardContent)({
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: 16,
        flexGrow: 1,
        '&:last-child': {
            paddingBottom: 16,
        },
    });

    const StyledTypography = styled(Typography)({
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    });

    function Author({ authors }: { authors: { name: string; avatar: string }[] }) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                }}
            >
                <Box
                    sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
                >
                    <AvatarGroup max={3}>
                        {authors.map((author, index) => (
                            <Avatar
                                key={index}
                                alt={author.name}
                                src={author.avatar}
                                sx={{ width: 24, height: 24 }}
                            />
                        ))}
                    </AvatarGroup>
                    <Typography variant="caption">
                        {authors.map((author) => author.name).join(', ')}
                    </Typography>
                </Box>
                <Typography variant="caption">July 14, 2021</Typography>
            </Box>
        );
    }


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
            <Container
                maxWidth="lg"
                component="main"
                sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
            >
                <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                    <Grid container spacing={2} columns={12}>

                        {loadingPets && (
                            <CircularProgress />
                        )}  
                        {pets?.length > 0 && (pets?.map(m =>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <SyledCard
                                    variant="outlined"
                                    sx={{ height: '100%' }}
                                >
                                    <CardMedia
                                        component="img"
                                        alt={m.petPhotos[0].fileName}
                                        image="https://picsum.photos/800/450?random=1"
                                       /// image={m.petPhotos[0].fileData}
                                        sx={{
                                            height: { sm: 'auto', md: '50%' },
                                            aspectRatio: { sm: '16 / 9', md: '' },
                                        }}
                                    />
                                    <SyledCardContent>
                                        <Typography gutterBottom variant="caption" component="div">
                                            {m.name}
                                        </Typography>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {m.name}
                                        </Typography>
                                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                                            {m.name}
                                        </StyledTypography>
                                    </SyledCardContent>
                                   {/* <Author authors={m.name} />*/}
                                </SyledCard>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
            </AppTheme>
       /* </AuthorizeView>*/
    );
}
