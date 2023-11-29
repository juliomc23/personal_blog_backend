export const appConfig = () => ({
  port: +process.env.APP_PORT || 3000,
  env: process.env.CURRENT_ENV || "dev",
  jwtSecret: process.env.JWT_SECRET,
  refreshJwtSecret: process.env.REFRESH_JWT_SECRET,
  saltOrRounds: +process.env.SALT_OR_ROUNDS || 10,
  hashPassword: process.env.HASH_PASSWORD,
});
