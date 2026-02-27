# Food

- App: [https://nuuuwan.github.io/food](https://nuuuwan.github.io/food)
- [Design Document](DESIGN.md)

## Backend (Vercel)

This project now includes a Node-based Vercel mock backend under `api/`:

- `GET /api/foods` - list food history
- `GET /api/foods/:id` - fetch a food analysis
- `POST /api/foods` - save a food analysis
- `POST /api/analyze` - mock photo analysis

`FoodAPIClient` calls these endpoints over HTTP.

### Local development

Run frontend and backend in separate terminals:

1. Frontend: `npm start`
2. Backend: `npm run start:backend`

If your frontend is not served from the same origin as Vercel backend, set:

- `REACT_APP_API_BASE_URL=http://localhost:3001` (or your deployed backend URL)
