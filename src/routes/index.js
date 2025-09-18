const registerAuthRoutes = require('./authRoutes');
const registerUserRoutes = require('./userRoutes');
const registerDebtRoutes = require('./debtRoutes');
const registerStrategyRoutes = require('./strategyRoutes');
const registerAnalyticsRoutes = require('./analyticsRoutes');
const registerReminderRoutes = require('./reminderRoutes');

function registerRoutes(router, context) {
  registerAuthRoutes(router, context);
  registerUserRoutes(router, context);
  registerDebtRoutes(router, context);
  registerStrategyRoutes(router, context);
  registerAnalyticsRoutes(router, context);
  registerReminderRoutes(router, context);
}

module.exports = registerRoutes;
