# Cloud Resource Autoscaler - Frontend

A production-grade React + TypeScript frontend for managing AWS EC2 instance monitoring and autoscaling.

## Features

- **JWT Authentication**: Secure login with token-based auth
- **Instance Management**: Register and monitor AWS EC2 instances
- **Real-time Metrics**: View CPU and memory usage charts
- **Scaling Decisions**: Track autoscaling recommendations with detailed reasoning
- **Clean Architecture**: Separation of concerns with services, types, and components

## Tech Stack

- **React 18** with functional components and hooks
- **TypeScript** for type safety
- **React Router** for client-side routing
- **Axios** for HTTP requests with JWT interceptors
- **Recharts** for data visualization
- **React Context** for state management

## Project Structure

```
frontend/
├── src/
│   ├── api/              # Axios instance with interceptors
│   ├── services/         # API service layer (auth, instances, metrics)
│   ├── types/            # TypeScript type definitions
│   ├── context/          # React Context (auth state)
│   ├── hooks/            # Custom React hooks
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page-level components
│   ├── utils/            # Utility functions (storage, chart helpers)
│   ├── App.tsx           # Main app with routing
│   ├── index.tsx         # Entry point
│   └── index.css         # Global styles
├── public/
│   └── index.html
├── .env                  # Environment configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

The `.env` file is already configured with the default local API URL:

```
REACT_APP_API_BASE_URL=http://localhost:5000
```

If your backend runs on a different URL, update this variable.

### 3. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Usage

### Login

1. Navigate to `/login`
2. Enter your email and password
3. On successful login, you'll be redirected to the instances page

### Manage Instances

1. View all your registered instances
2. Click **Register New Instance** to add an EC2 instance
3. Start/stop monitoring for each instance
4. Click **View Metrics** to see detailed performance data

### View Metrics

1. See CPU and Memory usage charts over time
2. Review scaling decisions with timestamps and reasoning
3. Click **Refresh Data** to update metrics

## API Integration

All API calls strictly follow the OpenAPI specification:

- `/api/auth/login` - User authentication
- `/api/auth/register` - User registration
- `/api/instances/` - List and register instances
- `/api/instances/{id}/monitor/start` - Start monitoring
- `/api/instances/{id}/monitor/stop` - Stop monitoring
- `/api/metrics/{id}` - Fetch instance metrics
- `/api/metrics/decisions/{id}` - Fetch scaling decisions

## Authentication Flow

1. User logs in via `/login`
2. JWT token is saved to `localStorage`
3. Axios request interceptor attaches token to all API calls
4. On 401 error, user is automatically logged out and redirected

## Design Decisions

### Token Storage
- **Choice**: `localStorage`
- **Rationale**: Simple, persists across sessions, suitable for SPAs
- **Trade-off**: Vulnerable to XSS; for production, consider `httpOnly` cookies

### State Management
- **Choice**: React Context for auth state only
- **Rationale**: Lightweight, sufficient for this app size
- **Alternative**: Redux would add unnecessary complexity

### Charts
- **Choice**: Recharts
- **Rationale**: React-native, good TypeScript support, simple API

### Styling
- **Choice**: Minimal inline CSS
- **Rationale**: Per requirements, focus on architecture over aesthetics

## Error Handling

- **Network errors**: User-friendly messages displayed inline
- **401 Unauthorized**: Auto-logout and redirect to login
- **Empty states**: Informative messages when no data exists
- **Loading states**: Simple "Loading..." text during async operations

## Type Safety

All API contracts are strictly typed using TypeScript interfaces that match the OpenAPI schema:

- `User`, `LoginResponse`, `RegisterResponse`
- `Instance`, `InstanceRegistration`
- `Metric`, `ScalingDecision`

## Future Improvements

1. **Real-time updates**: Add polling or WebSocket for live metrics
2. **Pagination**: Implement cursor-based pagination for large datasets
3. **Enhanced security**: Migrate to `httpOnly` cookies with CSRF protection
4. **Testing**: Add unit tests (Jest) and integration tests (React Testing Library)
5. **Accessibility**: Add ARIA labels and keyboard navigation
6. **Error boundaries**: Implement React error boundaries for graceful failures

## License

Proprietary - Internal Use Only
