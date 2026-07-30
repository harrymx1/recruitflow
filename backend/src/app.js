require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');
const { initCron } = require('./cron/jobStatus.cron');

const app = express();

// Init Cron Jobs
initCron();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// Routes
// Auth
app.use('/api/auth/company', require('./routes/auth.company.routes'));
app.use('/api/auth/candidate', require('./routes/auth.candidate.routes'));

// Dashboard (HR)
app.use('/api/dashboard/company', require('./routes/companies.routes'));
app.use('/api/dashboard/jobs', require('./routes/jobs.routes'));
app.use('/api/dashboard', require('./routes/pipeline.routes'));
app.use('/api/dashboard/candidates', require('./routes/hr.candidates.routes'));
app.use('/api/dashboard/applications', require('./routes/activityLogs.routes'));
app.use('/api/dashboard/analytics', require('./routes/analytics.routes'));
app.use('/api/dashboard/interviews', require('./routes/hr.interviews.routes'));
app.use('/api/dashboard/tags', require('./routes/hr.tags.routes'));
app.use('/api/dashboard/email-templates', require('./routes/hr.emailTemplates.routes'));

// Candidate Portal
app.use('/api/candidate/jobs', require('./routes/candidate.jobs.routes'));
app.use('/api/candidate/profile', require('./routes/candidate.profile.routes'));
app.use('/api/candidate/applications', require('./routes/candidate.application.routes'));

// Uploads
app.use('/api/uploads', require('./routes/upload.routes'));

// Public
app.use('/api/public/companies', require('./routes/public.companies.routes'));
app.use('/api/public/jobs', require('./routes/public.jobs.routes'));

// Subscriptions
app.use('/api/subscriptions', require('./routes/subscriptions.routes'));

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
