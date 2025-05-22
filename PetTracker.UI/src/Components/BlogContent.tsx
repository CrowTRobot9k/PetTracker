import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import useOwnersStore from '../Stores/OwnersStore';
import Carousel from '../Components/Carousel/Carousel';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { getImageUrlFromBlob } from '../Util/CommonFunctions'




const cardData = [
    {
        img: 'https://picsum.photos/800/450?random=1',
        tag: 'Engineering',
        title: 'Revolutionizing software development with cutting-edge tools',
        description:
            'Our latest engineering tools are designed to streamline workflows and boost productivity. Discover how these innovations are transforming the software development landscape.',
        authors: [
            { name: 'Remy Sharp', avatar: '/static/images/avatar/1.jpg' },
            { name: 'Travis Howard', avatar: '/static/images/avatar/2.jpg' },
        ],
    },
    {
        img: 'https://picsum.photos/800/450?random=2',
        tag: 'Product',
        title: 'Innovative product features that drive success',
        description:
            'Explore the key features of our latest product release that are helping businesses achieve their goals. From user-friendly interfaces to robust functionality, learn why our product stands out.',
        authors: [{ name: 'Erica Johns', avatar: '/static/images/avatar/6.jpg' }],
    },
    {
        img: 'https://picsum.photos/800/450?random=3',
        tag: 'Design',
        title: 'Designing for the future: trends and insights',
        description:
            'Stay ahead of the curve with the latest design trends and insights. Our design team shares their expertise on creating intuitive and visually stunning user experiences.',
        authors: [{ name: 'Kate Morrison', avatar: '/static/images/avatar/7.jpg' }],
    },
    {
        img: 'https://picsum.photos/800/450?random=4',
        tag: 'Company',
        title: "Our company's journey: milestones and achievements",
        description:
            "Take a look at our company's journey and the milestones we've achieved along the way. From humble beginnings to industry leader, discover our story of growth and success.",
        authors: [{ name: 'Cindy Baker', avatar: '/static/images/avatar/3.jpg' }],
    },
    {
        img: 'https://picsum.photos/800/450?random=45',
        tag: 'Engineering',
        title: 'Pioneering sustainable engineering solutions',
        description:
            "Learn about our commitment to sustainability and the innovative engineering solutions we're implementing to create a greener future. Discover the impact of our eco-friendly initiatives.",
        authors: [
            { name: 'Agnes Walker', avatar: '/static/images/avatar/4.jpg' },
            { name: 'Trevor Henderson', avatar: '/static/images/avatar/5.jpg' },
        ],
    },
    {
        img: 'https://picsum.photos/800/450?random=6',
        tag: 'Product',
        title: 'Maximizing efficiency with our latest product updates',
        description:
            'Our recent product updates are designed to help you maximize efficiency and achieve more. Get a detailed overview of the new features and improvements that can elevate your workflow.',
        authors: [{ name: 'Travis Howard', avatar: '/static/images/avatar/2.jpg' }],
    },
];

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

export default function BlogContent(props: { disableCustomTheme?: boolean }) {
    const getOwners = useOwnersStore((state) => state.getOwners);
    const getStates = useOwnersStore((state) => state.getStates);
    const states = useOwnersStore((state) => state.states);
    const { owners, loadingOwners } = useOwnersStore();
    const [open, setOpen] = React.useState(false);
    const [openViewOwner, setOpenViewOwner] = React.useState(false);
    const [selectedOwner, setSelectedOwner] = useState<Owner>(
        {
        });
    const [reloadOwners, setReloadOwners] = React.useState(false);

    useEffect(() => {
        getOwners();
    }, [reloadOwners]);

    useEffect(() => {
        getStates();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getOwnerSlides = (images) => {
        return Array.from(images.map((f, index) => (
            <img key={`${index}_${f.fileName}`} src={getImageUrlFromBlob(f.fileDataBase64)} />
        )))
    }

    const handleOpenOwner = (owner) => {
        const copiedOwner = JSON.parse(JSON.stringify(owner));
        setSelectedOwner(copiedOwner);
        setOpenViewOwner(true);
    }

    const handleCloseOwner = () => {
        setOpenViewOwner(false);
    };

    return (
        <>        
        {(!loadingOwners || loadingOwners) && (
            <Grid container spacing={2} columns={12} sx={{
                //height: '400px',
                //width: '100%',
                display: 'flex',
                flexDirection: 'row',
                //alignItems: 'center',
                //justifyContent: 'center',
             }}>
                    <Grid
                        size={owners.length < 3 ? "grow" : 4}
                        sx={{ height: '380px' }}
                    >
                    <Card
                            //variant="outlined"
                            sx={{
                                height: '100%',
                                //width: '100%',
                                display: 'flex',
                                //flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                    >
                        <Button onClick={handleClickOpen} variant="contained" color="info" endIcon={<AddIcon />}>
                            Add Owner
                        </Button>
                    </Card>
                </Grid>
                {owners?.map(m =>
                    <Grid 
                        size={owners.length < 3 ? "grow" : 4}
                        sx={{ height: '380px' }}
                    >
                        <Card
                            variant="outlined"
                            sx={{
                                //height: '100%',
                                ////width: '100%',
                                //display: 'flex',
                                ////flexDirection: 'row',
                                //alignItems: 'center',
                                //justifyContent: 'center',
                            }}
                        >
                            <Carousel cards={getOwnerSlides(m.ownerPhotos)} />
                            {/*<CardMedia*/}
                            {/*    component="img"*/}
                            {/*    alt="green iguana"*/}
                            {/*    image={cardData[0].img}*/}
                            {/*    sx={{*/}
                            {/*        aspectRatio: '16 / 9',*/}
                            {/*        borderBottom: '1px solid',*/}
                            {/*        borderColor: 'divider',*/}
                            {/*    }}*/}
                            {/*/>*/}
                            <SyledCardContent>
                                <Typography gutterBottom variant="caption" component="div">
                                    {cardData[0].tag}
                                </Typography>
                                <Typography gutterBottom variant="h6" component="div">
                                    {cardData[0].title}
                                </Typography>
                                <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                                    {cardData[0].description}
                                </StyledTypography>
                            </SyledCardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
            )}
        </>
    );
}
