export default () => ({
  port: parseInt(process.env.PORT, 10) || 7500,
  env: process.env.NODE_ENV,
  service: {
    name: 'MUMZWORLD-TEST',
    jwt: {
      secret: process.env.JWT_SECRET,
      apiUsername: process.env.JWT_API_USERNAME,
      apiPassword: process.env.JWT_API_PASSWORD,
    },
    database: {
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [],
      synchronize: (process.env.DB_SYNC == "true" ? true : false),
    },
  },
  weatherApp: {
    url: process.env.WEATHER_APP_BASE_URL,
    apikey: process.env.WEATHER_APP_APIKEY
  }
});
