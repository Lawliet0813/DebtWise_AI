const createAuthService = require('./authService');
const createUserService = require('./userService');
const createDebtService = require('./debtService');
const createStrategyService = require('./strategyService');
const createAnalyticsService = require('./analyticsService');
const createReminderService = require('./reminderService');

function createServices(context) {
  const userService = createUserService(context);
  const services = {
    auth: null,
    user: userService,
    debt: null,
    strategy: null,
    analytics: null,
    reminder: null,
  };
  services.auth = createAuthService({ ...context, services });
  services.debt = createDebtService({ ...context, services });
  services.strategy = createStrategyService({ ...context, services });
  services.analytics = createAnalyticsService({ ...context, services });
  services.reminder = createReminderService({ ...context, services });
  return services;
}

module.exports = createServices;
