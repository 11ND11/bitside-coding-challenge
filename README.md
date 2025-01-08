# Bitside Coding Challenge - Shopping Basket Application

A simple client-side shopping basket implementation with TypeScript, demonstrating promotions and discounts functionality.

## Overview

This is a standalone HTML application that runs without a server. All business logic is compiled into a single `bundle.js` file using esbuild.

## Getting started

Open the `index.html` in your browser.

## Project Structure

- `src/models/` - Contains TypeScript interfaces and classes (Basket, Inventory, Promotions)
- `src/services/` - Contains service classes managing the business logic
- `src/data/` - Contains static data configuration
- `index.html` - Main application view

### Key Components

- **Basket**: Manages shopping cart items and calculates totals
- **InventoryService**: Manages available products
- **PromotionService**: Handles different types of promotions (e.g., "Buy 1 Get 1 Free", "10% Off")

## Data Configuration

Product and promotion data is stored in `src/data/staticData.ts`. You can modify this file to change available products and promotions. After modification you have to rebuild the application:

```
// Example data structure
export const inventoryData = [
{ "sku": "A0001", "name": "Product A", "price": 12.99 },
// ...
];
export const promotionsData = [
{ "sku": "A0001", "type": "tenPercentOff" },
// ...
];
```

## Rebuild Application

1. Install dependencies:

`npm install`

2. Build the application:

`npm run build`

3. Open `index.html` in your browser

## Development Commands

- `npm run build` - Builds the application using esbuild
- `npm run lint` - Runs ESLint for code quality checks
- `npm run type-check` - Runs TypeScript type checking
- `npm start` - Starts the build process in watch mode

## Technical Details

### General

- Built with TypeScript and compiled to ES2017
- Uses Bootstrap 5 for styling (loaded via CDN)
- No server required - runs directly in the browser
- Modular architecture with clear separation of components

The application follows a clear separation between models and services:
- **Models**: Define the core data structures and business rules (e.g., Basket, Promotion).
  They are independent of the application's technical implementation.
- **Services**: Handle the application logic and coordinate between different models.
  They encapsulate specific functionality like inventory management or promotion calculations.

This separation provides:
- Better maintainability through clear responsibilities
- Easier testing as models and services can be tested independently
- Improved reusability of components
- Simplified future modifications or extensions

### Future Improvements and Notes

This is a proof of concept and not intended for production use. Several improvements should be considered:

#### Architecture
- Move business logic to server-side, keeping only display logic on the client
- Develop a clean architecture defining which components should run on server vs. client
- Implement proper API communication between client and server

#### Data Handling
- Add proper data validation
- Implement caching strategies for large datasets
- Consider batch processing for bulk operations

#### Testing
- Add comprehensive test coverage (unit tests, integration tests)
- Add proper error handling and edge case testing

#### Security
- Move all calculations to server-side to prevent manipulation
- Implement proper authentication and authorization
- Add input validation and sanitization

#### Maintenance
- add comments and expand technical documentation
- use specific coding guidelines
