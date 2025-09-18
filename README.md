# DebtWise AI Backend Prototype

DebtWise AI is a debt management and intelligent repayment planning platform. This repository contains a standalone Node.js backend implemented without third-party dependencies to satisfy restricted runtime environments. The service exposes REST-style endpoints for authentication, debt CRUD, repayment simulations (snowball & avalanche), reminders, and analytics.

## Features

- **User Management** – registration, login, profile updates, and membership upgrades (free vs. premium).
- **Debt Management** – create, update, delete debts with balance tracking, payment history, and membership-based limits.
- **Repayment Strategies** – deterministic simulation of snowball and avalanche strategies with payoff timelines and interest projections.
- **Reminders & Notifications** – automatic upcoming due-date reminders plus user-defined custom reminders.
- **Analytics & Visualisation Support** – aggregated metrics for totals, distributions, and payment trends to power dashboard charts.
- **Offline-Friendly Storage** – JSON file persistence (`data/db.json`) to keep the project runnable without external services.

## Getting Started

```bash
npm install # no-op (zero external dependencies)
npm run dev
```

The API listens on port `4000` by default. Override with `PORT=5000 npm run dev`.

### Key Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `POST` | `/auth/register` | Create a new user account. |
| `POST` | `/auth/login` | Obtain an access token. |
| `GET` | `/users/me` | Retrieve authenticated user profile. |
| `POST` | `/debts` | Create a debt (free tier limited to 5 debts). |
| `POST` | `/debts/:id/payments` | Record a payment and update balance. |
| `POST` | `/strategies/simulate` | Run snowball or avalanche simulations. |
| `GET` | `/analytics/summary` | Fetch totals and payoff progress. |
| `GET` | `/reminders/upcoming` | List automatic and custom reminders. |

Authentication relies on a bearer token returned by login/registration responses.

## Running Tests

```bash
npm test
```

Node's built-in test runner validates repayment strategy calculations and error handling.

## Project Structure

```
src/
  algorithms/       # Snowball & avalanche simulation logic
  services/         # Domain services operating on the data store
  routes/           # HTTP route registrations
  http/router.js    # Minimal routing & auth layer
  storage/          # File-based persistence
  utils/            # Shared helpers (JWT, validation, etc.)
data/db.json        # Persistent storage
```

## Roadmap

- Replace JSON storage with Postgres or Firestore adapters.
- Add push notification integrations (APNs/FCM).
- Provide PDF export and predictive analytics for premium tier (v2 goals).

## Security Notes

- Passwords are hashed with PBKDF2 (120k iterations, SHA-512).
- JWT generation implemented with HMAC-SHA256 and configurable expiry.
- Ensure the default secret (`JWT_SECRET`) is overridden in production deployments.
