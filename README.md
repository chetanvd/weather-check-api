<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

Create .env file in root of directory and copy paste the data from config/.default.env

NOTE : make sure you replace respective values in .env

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Documentation

### 1. Get Current Weather

Fetches the current weather data for India.

```bash
curl --location 'http://localhost:7500/mumzworld/weather/india'
```

### 2. Get Forecast

Fetches the weather forecast for Australia.

```bash
curl --location 'http://localhost:7500/mumzworld/forecast/aus'
```

### 3. Get All Users

Fetches all users.

```bash
curl --location 'http://localhost:7500/mumzworld/users' \
--header 'Authorization: Bearer <your-jwt-token>'
```

### 4. Get User by UserID

Fetch a user by their user ID.

```bash
curl --location 'http://localhost:7500/mumzworld/users/1' \
--header 'Authorization: Bearer <your-jwt-token>'
```

### 5. Create User

Creates a new user with a given username.

```bash
curl --location 'http://localhost:7500/mumzworld/users' \
--header 'Authorization: Bearer <your-jwt-token>' \
--header 'Content-Type: application/json' \
--data '{
  "username": "chetand"
}'
```

### 6. Get All Locations

Fetches all locations.

```bash
curl --location 'http://localhost:7500/mumzworld/locations' \
--header 'Authorization: Bearer <your-jwt-token>'
```

### 7. Get Location by ID

Fetch a location by its ID.

```bash
curl --location 'http://localhost:7500/mumzworld/locations/1' \
--header 'Authorization: Bearer <your-jwt-token>'
```

### 8. Get Locations by UserID

Fetches all locations associated with a specific user.

```bash
curl --location 'http://localhost:7500/mumzworld/locations/user/1' \
--header 'Authorization: Bearer <your-jwt-token>'
```

### 9. Create Location

Creates a new location with the given title and user ID.

```bash
curl --location 'http://localhost:7500/mumzworld/locations' \
--header 'Authorization: Bearer <your-jwt-token>' \
--header 'Content-Type: application/json' \
--data '{
  "title": "india",
  "userId": 1
}'
```

### 10. Delete Location

Deletes a location by its ID.

```bash
curl --location --request DELETE 'http://localhost:7500/mumzworld/locations/1' \
--header 'Authorization: Bearer <your-jwt-token>'
```

### 11. Health API

Checks the health status of the application.

```bash
curl --location 'http://localhost:7500/mumzworld/\_health'
```

### 12. Generate JWT Token

Generates a new JWT token.

```bash
curl --location --request POST 'http://localhost:7500/mumzworld/generate/jwt'
```

## Explanation of caching strategy

### 1. Current Weather Caching

The Current Weather API fetches real-time weather data for a location. Since weather conditions can change frequently, we implement a short-lived cache for this data. However, the cache doesn't need to be refreshed on every request—this avoids excessive API calls to the external weather service.

#### Key Aspects:

- Cache Duration: The cache duration is set based on the end of the current hour using the getMillisecondsUntilEndOfHour() function. This ensures that weather data is refreshed at the end of each hour, reducing the number of calls to the weather service while ensuring relatively fresh data.
- Cache Expiration: At the end of each hour, the cached weather data is invalidated, and a fresh API call is made to fetch the updated current weather data. This means that users will typically get updated data once every hour, although cache refresh happens based on the function's timing mechanism.

Example:

If a request for the current weather is made at 12:15 PM, the cache will expire at 1:00 PM (end of the current hour), meaning the next API call will retrieve the latest data after the cache expires.

### 2. Forecast Caching

The Forecast API provides weather predictions for the future (e.g., hourly or daily forecasts). Since forecasts don’t change drastically from one moment to the next (especially for short-term predictions), the data can be cached for a longer period compared to current weather.

#### Key Aspects:

- Cache Duration: The forecast data is cached based on the end of the current day using the getMillisecondsUntilEndOfDay() function. This ensures that forecast data is refreshed once per day, but not more frequently unless necessary.
- Cache Expiration: After a full day (i.e., at midnight), the cached forecast data is invalidated, and a new API call is made to fetch the updated forecast for the next day.

Example:

If a request for the forecast is made at 12:15 PM, the cached forecast data will be valid until 11:59:59.999 PM on the same day. After midnight (the end of the day), the cache will be refreshed with a new forecast.
