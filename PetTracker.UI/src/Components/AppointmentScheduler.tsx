import React, { useCallback, useState, useMemo, Fragment } from 'react'
import moment from 'moment'
import { momentLocalizer } from 'react-big-calendar'
import PropTypes from 'prop-types'
import { Calendar, Views } from 'react-big-calendar'
import events from '../TestData/events'
import { Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const useStyles = makeStyles({
    calendar: {
        '& .rbc-event': {
            backgroundColor: '#3f51b5',
            color: '#fff',
        },
        '& .rbc-selected': {
            backgroundColor: '#757de8',
        },
    },
});

export default function AppointmentScheduler() {

    const localizer = new momentLocalizer(moment);
    const dayLayoutAlgorithm = 'no-overlap';
    const [myEvents, setEvents] = useState(events)

    const classes = useStyles();

    const handleSelectSlot = useCallback(
        ({ start, end }) => {
            const title = window.prompt('New Event Name')
            if (title) {
                setEvents((prev) => [...prev, { start, end, title }])
            }
        },
        [setEvents]
    )

    const handleSelectEvent = useCallback(
        (event) => window.alert(event.title),
        []
    )

    const { defaultDate, scrollToTime } = useMemo(
        () => ({
            defaultDate: new Date(2015, 3, 12),
            scrollToTime: new Date(1970, 1, 1, 6),
        }),
        []
    )

    return (
        <Container maxWidth="xl" component="main" sx={{
            my: 2, alignItems: 'center',
            justifyContent: 'center',width:'2000px'}}>
                <Calendar
                    dayLayoutAlgorithm={dayLayoutAlgorithm}
                    defaultDate={defaultDate}
                    defaultView={Views.WEEK}
                    events={myEvents}
                    localizer={localizer}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    selectable
                    style={{ height: 700 }}
                    scrollToTime={scrollToTime}
                    className={classes.calendar}
                />
        </Container>
    )
}