# LunarEats - Food Delivery on the Moon

Welcome to LunarEats, a conceptual food delivery application built entirely with React and a Manifest backend. This project demonstrates a complete full-stack application for ordering food from various lunar cantinas for delivery to your crater.

## Features

- **User Authentication**: Customers can sign up and log in to place orders.
- **Restaurant Browsing**: View a list of available restaurants (Lunar Cantinas) with their logos and descriptions.
- **Menu Viewing**: Select a restaurant to see its full menu, complete with item photos, descriptions, and prices.
- **Shopping Cart**: Add and remove items from your cart before placing an order.
- **Order Placement**: Place an order by specifying a delivery crater.
- **Order Tracking**: View a list of your past and current orders with real-time status updates (Pending, Preparing, In Transit, Delivered).
- **Role-Based Access**: The app distinguishes between 'customer' and 'admin' roles, with a dedicated link to the Manifest Admin Panel for administrators.

## Backend (Manifest)

The backend is powered by Manifest, which auto-generates a database, REST API, and admin panel based on a simple YAML configuration file (`manifest.yml`).

### Entities

- **User**: Represents customers and admins. Features `authenticable` for login, and a `role` property.
- **Restaurant**: Represents the food establishments, each with a name, description, and logo image.
- **MenuItem**: Represents a food item, belonging to a restaurant. Includes `price` (money type) and `photo` (image type).
- **Order**: Represents a customer's order. It tracks the customer, restaurant, delivery crater, total price, and status (`choice` type).

## Getting Started

### Prerequisites

- Node.js and npm
- A running Manifest backend instance.

### Frontend Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env.local` file in the root of the project and add your Manifest backend URL:
    ```
    VITE_BACKEND_URL=your-manifest-backend-url
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Admin Access

- The Manifest Admin Panel is available at `your-manifest-backend-url/admin`.
- Default credentials: `admin@manifest.build` / `admin`.
- Use the admin panel to create restaurants and menu items to populate the app.