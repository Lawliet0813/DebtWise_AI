import './components/DebtWiseDashboard.js';

document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('app');
  const dashboard = document.createElement('debtwise-dashboard');
  dashboard.apiBase = window.location.origin.includes('http') ? '' : 'http://localhost:4000';
  mount.appendChild(dashboard);
});
