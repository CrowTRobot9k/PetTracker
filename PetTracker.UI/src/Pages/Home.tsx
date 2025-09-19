import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AuthorizeView from "../Components/AuthorizeView.tsx";
import { Button, Typography, Box, Card, CardContent } from '@mui/material';
import { Pets, People, Event, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router';

export default function Home(props: { disableCustomTheme?: boolean }) {
    const navigate = useNavigate();
    
    return (
        <AuthorizeView>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <AppAppBar currentPage="home"/>
                <Container
                    maxWidth="lg"
                    component="main"
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        my: 4, 
                        gap: 4
                    }}
                >
                    {/* Welcome Message */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h2" component="h1" gutterBottom sx={{ 
                            fontWeight: 'bold', 
                            color: 'primary.main',
                            mb: 2 
                        }}>
                            Welcome to Pet Tracker
                        </Typography>
                        <Typography variant="h5" component="h2" color="text.secondary" sx={{ mb: 3 }}>
                            Your solution for managing pets, owners, and appointments
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                            Streamline your pet care business with our platform designed to help you manage 
                            pet information, owner details, and scheduling all in one place.
                        </Typography>
                    </Box>

                    {/* Feature Cards */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
                        <Card 
                            sx={{ 
                                height: '100%', 
                                textAlign: 'center', 
                                p: 2,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    backgroundColor: 'action.hover'
                                }
                            }}
                            onClick={() => navigate('/owners')}
                        >
                            <CardContent>
                                <People sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" component="h3" gutterBottom>
                                    Owner Profiles
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Maintain comprehensive owner information and contact details
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card 
                            sx={{ 
                                height: '100%', 
                                textAlign: 'center', 
                                p: 2,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    backgroundColor: 'action.hover'
                                }
                            }}
                            onClick={() => navigate('/pets')}
                        >
                            <CardContent>
                                <Pets sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" component="h3" gutterBottom>
                                    Pet Management
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Keep detailed records of all pets including breed, age, and medical information
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card 
                            sx={{ 
                                height: '100%', 
                                textAlign: 'center', 
                                p: 2,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    backgroundColor: 'action.hover'
                                }
                            }}
                            onClick={() => navigate('/appointments')}
                        >
                            <CardContent>
                                <Event sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" component="h3" gutterBottom>
                                    Appointment Scheduling
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Efficiently manage appointments and track scheduling conflicts
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card 
                            sx={{ 
                                height: '100%', 
                                textAlign: 'center', 
                                p: 2,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    backgroundColor: 'action.hover'
                                }
                            }}
                            onClick={() => navigate('/users')}
                        >
                            <CardContent>
                                <Person sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" component="h3" gutterBottom>
                                    User Management
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Control access and manage user roles within your organization
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                </Container>
{/*                <PtFooter />*/}
            </AppTheme>
        </AuthorizeView>
    );
}
