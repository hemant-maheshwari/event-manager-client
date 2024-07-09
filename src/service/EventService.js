import axios from 'axios';

const API_URL = 'http://localhost:8000/api/events';

const getEvents = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching events', error);
        throw error;
    }
};

const createEvent = async (event) => {
    try {
        const response = await axios.post(API_URL, event);
        return response.data;
    } catch (error) {
        console.error('Error creating event', error);
        throw error;
    }
};

const updateEvent = async (id, event) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, event);
        return response.data;
    } catch (error) {
        console.error('Error updating event', error);
        throw error;
    }
};

const deleteEvent = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error('Error deleting event', error);
        throw error;
    }
};

export default {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
};
