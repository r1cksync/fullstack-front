# Weather Analytics Dashboard - Frontend

A modern, responsive weather dashboard built with React, Redux Toolkit, and Recharts.

Live Website Link : https://fullstack-front-green.vercel.app/

video demonstration of website: https://drive.google.com/file/d/1klRaP6oUF13uFuEVFh2V2Zcl9HuD_HLJ/view?usp=sharing

github repo of backend: https://github.com/r1cksync/fullstack-back


## Features

- 🌦️ **Real-time Weather Data** - Current conditions and forecasts
- 📊 **Interactive Charts** - Temperature trends, humidity, and more
- ⭐ **Favorites Management** - Save and track your favorite cities
- 🔍 **Smart Search** - City search with autocomplete
- 🔐 **Google Authentication** - Secure sign-in
- ⚙️ **Customizable Settings** - Temperature units (°C/°F), themes
- 📱 **Responsive Design** - Works on all devices
- 🔄 **Auto-refresh** - Data updates every 60 seconds

## Tech Stack

- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Google OAuth** - Authentication

## Setup

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Running the App

Development mode:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Charts/         # Chart components (Recharts)
│   ├── Layout/         # Header, Footer, etc.
│   ├── Search/         # Search bar with autocomplete
│   └── Weather/        # Weather-related components
├── pages/              # Page components
│   ├── Dashboard.js    # Main dashboard
│   ├── CityDetail.js   # Detailed city view
│   └── Settings.js     # User settings
├── store/              # Redux store
│   ├── slices/         # Redux slices
│   └── store.js        # Store configuration
├── services/           # API services
│   └── api.js          # Axios instance
├── utils/              # Utility functions
│   └── weatherIcons.js # Weather icon mapping
├── App.js              # Main app component
└── index.js            # Entry point
```

## Features in Detail

### Dashboard
- Displays weather cards for multiple cities
- Shows current temperature, conditions, humidity, and wind
- Click any card to view detailed information
- Add/remove cities from favorites

### City Detail View
- Current weather with comprehensive stats
- Temperature trend charts (Area chart)
- Humidity levels chart (Line chart)
- Hourly forecast (next 24 hours)
- 7-day daily forecast
- Detailed metrics: pressure, visibility, sunrise/sunset

### Search
- Type-ahead autocomplete
- Search cities worldwide
- Shows coordinates for precise location

### Settings
- Toggle between Celsius and Fahrenheit
- Theme selection (Light/Dark)
- Google sign-in integration
- Account information

## API Integration

The frontend communicates with the backend API for:
- Weather data (proxied from OpenWeatherMap)
- User authentication (Google OAuth)
- Favorites management
- User preferences storage

All API calls include:
- Automatic token refresh
- Error handling
- Request caching
- Rate limiting compliance

## Caching Strategy

- Weather data cached for 60 seconds
- Automatic refresh every 60 seconds
- Manual refresh available
- Reduces API calls and improves performance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC
