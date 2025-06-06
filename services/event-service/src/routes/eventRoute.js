import express from 'express';
import eventController from '../controllers/eventController.js';
import cloudinaryProvider from '../providers/cloudinaryProvider.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const Router = express.Router();

// Create event
Router.route('/organizer/create').post(
    authMiddleware.isValidPermission(['organizer', 'admin']),
    cloudinaryProvider.fields([
        { name: 'eventBackground', maxCount: 1 },
        { name: 'organizerLogo', maxCount: 1 },
    ]),
    eventController.createEvent,
);

// Get event summary
Router.route('/organizer/:eventId/summary').get(
    authMiddleware.isValidPermission(['organizer', 'admin']),
    eventController.getEventSummary,
);

// Get my events
Router.route('/organizer/my').get(
    authMiddleware.isValidPermission(['organizer', 'admin']),
    eventController.getMyEvents,
);

// Get all events
Router.route('/admin/all-events').get(
    authMiddleware.isValidPermission(['admin']),
    eventController.getAllEvents,
);

// Total events
Router.route('/admin/total-events').get(
    authMiddleware.isValidPermission(['admin']),
    eventController.getTotalEvents,
);

// Update event status (admin only)
Router.route('/admin/update/:id/status').put(
    authMiddleware.isValidPermission(['admin']),
    cloudinaryProvider.fields([
        { name: 'eventBackground', maxCount: 1 },
        { name: 'organizerLogo', maxCount: 1 },
    ]),
    eventController.updateEventStatus,
);

// Get event
Router.route('/').get(eventController.getEvents);

// Search
Router.route('/search').get(eventController.searchEvents);

// Get event by id to edit
Router.route('/:id/edit').get(
    authMiddleware.isValidPermission(['organizer', 'admin']),
    eventController.getEventByIdToEdit,
);

// Update event
Router.route('/update/:id').patch(
    authMiddleware.isValidPermission(['organizer', 'admin']),
    cloudinaryProvider.fields([
        { name: 'eventBackground', maxCount: 1 },
        { name: 'organizerLogo', maxCount: 1 },
    ]),
    eventController.updateEvent,
);

// Create order event
Router.route('/order/:id').post(
    authMiddleware.isValidPermission(['client', 'organizer', 'admin']),
    cloudinaryProvider.fields([
        { name: 'eventBackground', maxCount: 1 },
        { name: 'organizerLogo', maxCount: 1 },
    ]),
    eventController.createOrder,
);

// Get event by id
Router.route('/:id').get(eventController.getEventById);

export default Router;
