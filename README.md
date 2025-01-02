# Rental Mania

This project is a clone of Airbnb, built with modern web technologies. The application allows users to browse listings, view details, and book accommodations. It provides a robust backend and a responsive frontend, offering a seamless user experience.

## Features
- **User Authentication**: Secure login and registration.
- **Property Listings**: Browse available properties with detailed descriptions and photos.
- **Booking System**: Book accommodations with ease.
- **Search Functionality**: Filter listings based on location, price, and amenities.
- **Admin Panel**: Manage listings and bookings (optional).

## Tech Stack

### Frontend
- **Framework**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS

### Backend
- **Framework**: Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma

### Additional Tools
- **API Testing**: Postman/Insomnia
- **Version Control**: Git
- **Deployment**: Vercel for frontend, Heroku for backend (or specify your deployment services)

## Installation and Setup

### Prerequisites
Ensure you have the following installed:
- Node.js (>= 14.x)
- PostgreSQL
- npm or yarn

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rental-mania
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up the database:
   - Create a PostgreSQL database.
   - Update the `.env` file with your database credentials:
     ```env
     DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database_name>"
     ```

4. Apply database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the backend server:
   ```bash
   npm run dev:server
   ```

6. Start the frontend server:
   ```bash
   npm run dev:client
   ```

7. Access the application at `http://localhost:3000`.

## Scripts
- **`npm run dev:server`**: Starts the backend server in development mode.
- **`npm run dev:client`**: Starts the frontend server in development mode.
- **`npm run build`**: Builds the project for production.
- **`npm run start`**: Starts the project in production mode.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add some feature"`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

