import React, { useCallback, useState, useEffect, useMemo, Fragment } from 'react'
import moment from 'moment'
import { momentLocalizer } from 'react-big-calendar'
import PropTypes from 'prop-types'
import { Calendar, Views } from 'react-big-calendar'
import events from '../TestData/events'
import { Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useAppointmentsStore from '../Stores/AppointmentsStore'
import LoadingPlaceholder from '../Components/LoadingPlaceholder.tsx';
import ErrorDisplay from '../Components/ErrorDisplay.tsx';
import { convertDates } from '../Util/CommonFunctions'

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

    useEffect(() => {
        getAppointments();
    }, []);

    useEffect(() => {
        getOwnerList();
    }, []);

    const schedulerStyles = makeStyles({
        css: {
            '& .rbc-event': {
                backgroundColor: '#3f51b5',
                color: '#fff',
            },
            '& .rbc-selected': {
                backgroundColor: '#757de8',
            },
        },
    });

    const handleSelectSlot = useCallback(
        ({ start, end }) => {
            //const title = window.prompt('New Event Name')
            //if (title) {
            //    setEvents((prev) => [...prev, { start, end, title }])
            //}
        },
        []
    )

    const handleSelectEvent = useCallback(
        (event) => window.alert(event.title),
        []
    )

    const { defaultDate, scrollToTime } = useMemo(
        () => ({
            defaultDate: new Date(),
            scrollToTime: new Date(1970, 1, 1, 6),
        }),
        []
    )

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
                        //className={schedulerStyles.css}
                    />
                </Container>
            )}
        </>
    )
}