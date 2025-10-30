import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import experienceRoutes from './routes/experiences.routes.js';
import bookingRoutes from './routes/bookings.routes.js';
import promoRoutes from './routes/promo.routes.js';
const app = express();
// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
// Routes
app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/promo', promoRoutes);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
export default app;
//# sourceMappingURL=app.js.map