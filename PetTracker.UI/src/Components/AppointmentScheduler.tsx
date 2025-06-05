import React, { useCallback, useState, useEffect, useMemo, Fragment } from 'react'
import moment from 'moment'
import { momentLocalizer } from 'react-big-calendar'
import { Calendar, Views } from 'react-big-calendar'
import { Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useAppointmentsStore from '../Stores/AppointmentsStore'
import LoadingPlaceholder from '../Components/LoadingPlaceholder.tsx';
import ErrorDisplay from '../Components/ErrorDisplay.tsx';
import AddAppointment from '../Components/Appointments/AddAppointment.tsx';
import ViewAppointment from '../Components/Appointments/ViewAppointment.tsx'
import { Appointment } from '../Types/SharedTypes.tsx'
export default function AppointmentScheduler() {

    const localizer = new momentLocalizer(moment);
    const dayLayoutAlgorithm = 'no-overlap';

    const getAppointments = useAppointmentsStore((state) => state.getAppointments);
    const getOwnerList = useAppointmentsStore((state) => state.getOwnerList);

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
            setOpenAddAppt(true);
            setApptStart(start);
            setApptEnd(end);
        },
        []
    )

    const handleSelectEvent = useCallback(
        (event) => {
            setOpenViewAppt(true);
            setSelectedAppt(event);
            setApptStart(event.start);
            setApptEnd(event.end);
        },
        []
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

    return (
        <>
            {showErrors && (
                <ErrorDisplay error={errorMessage} height={700} />
            )}
            {loadingAppointments && (
                <LoadingPlaceholder />
            )}
            {(!showErrors && !loadingAppointments) && (
                <Container maxWidth="xl" component="main" sx={{
                    my: 2, alignItems: 'center',
                    justifyContent: 'center', width: '2000px'
                }}>
                    <Calendar
                        dayLayoutAlgorithm={dayLayoutAlgorithm}
                        defaultDate={defaultDate}
                        defaultView={Views.WEEK}
                        events={appointments}
                        localizer={localizer}
                        onSelectEvent={handleSelectEvent}
                        onSelectSlot={handleSelectSlot}
                        selectable
                        style={{ height: 700 }}
                        scrollToTime={scrollToTime}
                        components={{ event: customEvent }}
                    />
                    <AddAppointment open={openAddAppt} handleClose={handleCloseAddAppt} reloadAppointments={reloadAppts} setReloadAppointments={setReloadAppts} startDate={apptStart} endDate={apptEnd} owners={owners} />
                    <ViewAppointment open={openViewAppt} handleClose={handleCloseViewAppt} viewAppointment={selectedAppt } reloadAppointments={reloadAppts} setReloadAppointments={setReloadAppts} startDate={apptStart} endDate={apptEnd} owners={owners} />

                </Container>

            )}
        </>
    )
}