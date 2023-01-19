# RED ACRE CRYPTO WIDGET

A NestJS websocket service that consumes rate from API at a configurable interval. The service stores the data in a MongoDB database and streams it to the frontend via websockets.

## Getting Started

These instructions will guide you in setting up a copy of the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js and npm (comes with Node)
- Latest version of Node.js (19.4.0 or higher) can be downloaded from the [official website](https://nodejs.org/en/download/) or using a version manager such as [nvm](https://github.com/nvm-sh/nvm#installation)
- MongoDB installed locally or a MongoDB URL for a remote database
- API keys listed in a .env file (see .env.sample for an example)

### Installation
1. Navigate to the project directory: `cd crypto-widget-api`
2. Install the dependencies: `npm install`

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file, check the .env.sample file for reference:

- `DATABASE_URL`: MongoDB URL
- `CONFIGURABLE_CRON_TIME`: Cron-like time format for the rate consumption and streaming interval
- `API_RATE`: API endpoint for fetching rate data

## Running the App

1. Make sure MongoDB is running locally or the MongoDB URL is correctly configured in the .env file.

2. In the .env file, configure a periodic time `CONFIGURABLE_CRON_TIME` for rate consumption and streaming. Here are some examples of time formats that can be used:
  
  - `CONFIGURABLE_CRON_TIME=* * * * * *` (runs every second)
  - `CONFIGURABLE_CRON_TIME=*/5 * * * * *` (runs every 5 seconds)
  - `CONFIGURABLE_CRON_TIME=*/10 * * * * *` (runs every 10 seconds)
  - `CONFIGURABLE_CRON_TIME=*/30 * * * * *` (runs every 30 seconds)
  - `CONFIGURABLE_CRON_TIME=*/1 * * * *` (runs every 1 minute)
  - `CONFIGURABLE_CRON_TIME=0 */5 * * * *` (runs every 5 minutes)
  - `CONFIGURABLE_CRON_TIME=0 */10 * * * *` (runs every 10 minutes)
  - `CONFIGURABLE_CRON_TIME=0 */30 * * * *` (runs every 30 minutes)

3. Start the development server: `npm run start:dev`

Note: The `CONFIGURABLE_CRON_TIME` variable is used to set the schedule of data consumption and streaming, you can use any valid cron-like schedule as per your requirement.
