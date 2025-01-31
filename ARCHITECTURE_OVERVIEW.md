# Overview of the Architecture
The "Plan With Senja" project is a web application designed to facilitate event booking. This application is built using Next.js, React, and TypeScript, with Tailwind CSS integration for styling. The architecture follows a component-based pattern, where each part of the UI is broken down into reusable components.

## Project Structure
### Frontend:
- Uses Next.js for routing and server-side rendering.
- UI components are built with React, leveraging hooks such as `useState` and `useEffect` for state management and side effects.
- Registration and login forms use `react-hook-form` and `yup` for validation.
- Data is fetched from the API using `@tanstack/react-query` for asynchronous data management.

### Backend:
- Provides APIs to interact with the database, offering endpoints for user registration, login, and event booking.
- Uses Axios to make HTTP requests to the API.

### Styling:
- Tailwind CSS is used for styling, allowing quick and responsive adjustments.

## Assumptions Made
1. **Registered Users**: It is assumed that users must register and log in to book an event.
2. **Event Availability**: It is assumed that event details and seat availability are always up-to-date in the backend.
3. **Responsiveness**: The application is designed to function well across various devices, including desktops and mobiles.
4. **Security**: It is assumed that authentication tokens are securely stored in localStorage and used for managing user sessions.
5. **Data Validation**: It is assumed that all user input data will be validated before being sent to the server to prevent errors and misuse.

With this architecture, "Plan With Senja" aims to provide a seamless and efficient user experience in booking events.