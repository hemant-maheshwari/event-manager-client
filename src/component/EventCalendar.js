// src/EventCalendar.js
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import EventService from '../service/EventService.js';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
    const [events, setEvents] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState({ title: '', description: '', start_date: '', end_date: '' });
    const [formErrors, setFormErrors] = useState({ title: false, description: false, start_date: false, end_date: false });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const eventsData = await EventService.getEvents();
            const formattedEvents = eventsData.map(event => ({
                ...event,
                start: new Date(event.start_date),
                end: new Date(event.end_date)
            }));
            setEvents(formattedEvents);
        } catch (error) {
            console.error('Error fetching events', error);
        }
    };

    const handleSelectSlot = ({ start, end }) => {
        setCurrentEvent({ title: '', description: '', start_date: start.toISOString().slice(0, 16), end_date: end.toISOString().slice(0, 16) });
        setModalIsOpen(true);
    };

    const handleSelectEvent = (event) => {
        setCurrentEvent({
            ...event,
            start_date: new Date(event.start).toISOString().slice(0, 16),
            end_date: new Date(event.end).toISOString().slice(0, 16)
        });
        setModalIsOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentEvent({ ...currentEvent, [name]: value });
        setFormErrors({ ...formErrors, [name]: value.trim() === '' });
    };

    const validateForm = () => {
        const errors = {
            title: currentEvent.title.trim() === '',
            description: currentEvent.description.trim() === '',
            start_date: currentEvent.start_date.trim() === '',
            end_date: currentEvent.end_date.trim() === '',
        };
        setFormErrors(errors);
        return !Object.values(errors).includes(true);
    };

    const handleSaveEvent = async () => {
        if (!validateForm()) {
            return;
        }
        try {
            if (currentEvent.id) {
                await EventService.updateEvent(currentEvent.id, currentEvent);
            } else {
                await EventService.createEvent(currentEvent);
            }
            fetchEvents();
            setModalIsOpen(false);
        } catch (error) {
            console.error('Error saving event', error);
        }
    };

    const handleDeleteEvent = async () => {
        try {
            await EventService.deleteEvent(currentEvent.id);
            fetchEvents();
            setModalIsOpen(false);
        } catch (error) {
            console.error('Error deleting event', error);
        }
    };

    return (
        <div className="calendar-container">
            <div className="calendar">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    selectable
                    style={{ height: 500 }}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                />
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Event Modal"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <button className="close-button" onClick={() => setModalIsOpen(false)}>×</button>
                <h2>{currentEvent.id ? 'Edit Event' : 'Create Event'}</h2>
                <form className="event-form">
                    <input
                        type="text"
                        name="title"
                        value={currentEvent.title}
                        onChange={handleInputChange}
                        placeholder="Title"
                        required
                    />
                    {formErrors.title && <span className="error">Title is required</span>}
                    <textarea
                        name="description"
                        value={currentEvent.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        required
                    />
                    {formErrors.description && <span className="error">Description is required</span>}
                    <input
                        type="datetime-local"
                        name="start_date"
                        value={currentEvent.start_date}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.start_date && <span className="error">Start date and time are required</span>}
                    <input
                        type="datetime-local"
                        name="end_date"
                        value={currentEvent.end_date}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.end_date && <span className="error">End date and time are required</span>}
                    <button type="button" onClick={handleSaveEvent}>Save</button>
                    {currentEvent.id && <button type="button" onClick={handleDeleteEvent}>Delete</button>}
                </form>
            </Modal>
        </div>
    );
};

export default EventCalendar;
