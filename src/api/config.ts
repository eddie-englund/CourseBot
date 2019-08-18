const config = {
  ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 4000,
  URL: process.env.BASE_URL || 'http://localhost:3000'
};

export { config };