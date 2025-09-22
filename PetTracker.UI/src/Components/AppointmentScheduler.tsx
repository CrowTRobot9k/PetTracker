import React, { useCallback, useState, useEffect, useMemo, Fragment } from 'react'
import moment from 'moment'
import { momentLocalizer } from 'react-big-calendar'
import { Calendar, Views } from 'react-big-calendar'
import { Container, Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useAppointmentsStore from '../Stores/AppointmentsStore'
import { useAuthStore } from '../Stores/AuthStore'
import LoadingPlaceholder from '../Components/LoadingPlaceholder.tsx';
import ErrorDisplay from '../Components/ErrorDisplay.tsx';
import AddAppointment from '../Components/Appointments/AddAppointment.tsx';
import ViewAppointment from '../Components/Appointments/ViewAppointment.tsx'
import { Appointment } from '../Types/SharedTypes.tsx'
export default function AppointmentScheduler() {
    const { user } = useAuthStore();

    const localizer = new momentLocalizer(moment);
    const dayLayoutAlgorithm = 'no-overlap';

    const getAppointments = useAppointmentsStore((state) => state.getAppointments);
    const getOwnerList = useAppointmentsStore((state) => state.getOwnerList);

    // Check if user has read access to appointments
    const hasReadAccess = user?.roles?.some(role => 
        role.name === 'Administrator' || role.name === 'Appointments Read' || role.name === 'Appointments Write'
    ) ?? false;

    // Check if user has write or admin privileges for appointments
    const hasWriteAccess = user?.roles?.some(role => 
        role.name === 'Administrator' || role.name === 'Appointments Write'
    ) ?? false;

    const {
        appointments,
        loadingAppointments,
        loadingOwners,
        owners,
        errorMessage,
        showErrors
    } = useAppointmentsStore();

    const [openAddAppt, setOpenAddAppt] = React.useState(false);
    const [reloadAppts, setReloadAppts] = React.useState(false);
    const [apptStart, setApptStart] = useState(new Date());
    const [apptEnd, setApptEnd] = useState(new Date());

    const [openViewAppt, setOpenViewAppt] = React.useState(false);
    const [selectedAppt, setSelectedAppt] = useState<Appointment>(
        {
        });

    useEffect(() => {
        getAppointments();
    }, [reloadAppts]);

    useEffect(() => {
        getOwnerList();
    }, []);

    const handleCloseAddAppt = () => {
        setOpenAddAppt(false);
    };

    const handleCloseViewAppt = () => {
        setOpenViewAppt(false);
    }

    const handleSelectSlot = useCallback(
        ({ start, end }) =>
        {
            if (hasWriteAccess) {
                setOpenAddAppt(true);
                setApptStart(start);
                setApptEnd(end);
            }
        },
        [hasWriteAccess]
    )

    const handleSelectEvent = useCallback(
        (event) => {
            if (hasReadAccess) {
                setOpenViewAppt(true);
                setSelectedAppt(event);
                setApptStart(event.start);
                setApptEnd(event.end);
            }
        },
        [hasReadAccess]
    )

    const { defaultDate, scrollToTime } = useMemo(
        () => ({
            defaultDate: new Date(),
            scrollToTime: new Date(1970, 1, 1, 6),
        }),
        []
    )


    const customEvent = ({ event }) => {
        return (
            <div>
                {event.title} - {event.description}
                <br/>
                {event.owner} - {event.petName }
            </div>
        )
    }

    // Check if user has read access to appointments (only applies when not used within owner context)
    if (!hasReadAccess) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <Typography variant="h6" color="text.secondary">
                    You do not have permission to access the appointments page.
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {showErrors && (
                <ErrorDisplay error={errorMessage} height={700} />
            )}
            {loadingAppointments && (
                <LoadingPlaceholder />
            )}
            {(!showErrors && !loadingAppointments) && (
                <>
                    <Calendar
                        dayLayoutAlgorithm={dayLayoutAlgorithm}
                        defaultDate={defaultDate}
                        defaultView={Views.WEEK}
                        events={appointments}
                        localizer={localizer}
                        onSelectEvent={handleSelectEvent}
                        onSelectSlot={handleSelectSlot}
                        selectable={hasWriteAccess}
                        style={{ height: 700, width: '100%', minWidth: '100%' }}
                        scrollToTime={scrollToTime}
                        components={{ event: customEvent }}
                    />
                    {hasWriteAccess && (
                        <AddAppointment open={openAddAppt} handleClose={handleCloseAddAppt} reloadAppointments={reloadAppts} setReloadAppointments={setReloadAppts} startDate={apptStart} endDate={apptEnd} owners={owners} />
                    )}
                    <ViewAppointment open={openViewAppt} handleClose={handleCloseViewAppt} viewAppointment={selectedAppt} reloadAppointments={reloadAppts} setReloadAppointments={setReloadAppts} startDate={apptStart} endDate={apptEnd} owners={owners} hasWriteAccess={hasWriteAccess} />
                </>

            )}
        </>
    )
}