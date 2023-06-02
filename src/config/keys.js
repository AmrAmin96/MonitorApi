module.exports = {
  mongoURI:
    process.env.NODE_ENV === 'test'
      ? process.env.MONGO_CON_TEST
      : process.env.NODE_ENV !== 'production'
      ? process.env.MONGO_CON_DEV
      : process.env.MONGO_CON_PROD,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  useInMemoryDb: false, // Boolean(process.env.USE_IN_MEMORY_DB),
}
