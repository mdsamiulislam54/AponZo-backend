import "dotenv/config";
import env from "env-var"

const envConfig = {
   env: env.get("NODE_ENV").default("development").asString(),
   port: env.get("PORT").default("8080").asString(),
   databaseUrl: env.get("DATABASE_URL").required().asString(),
   auth_secret: env.get("BETTER_AUTH_SECRET").asString(),
   auth_url: env.get("BETTER_AUTH_URL").asString(),
   jwt_secret: env.get("JWT_SECRET").asString(),
   access_token_expires_in: env.get("ACCESS_TOKEN_EXPIRES_IN").asString(),
   refresh_token_expires_in: env.get("REFRESH_TOKEN_EXPIRES_IN").asString(),
   email_from: env.get("EMAIL_FROM").asString(),
   smtp_host: env.get("SMTP_HOST").asString(),
   smtp_port: env.get("SMTP_PORT"),
   smtp_password: env.get("SMTP_PASSWORD").asString(),
   app_name: env.get("APP_NAME").asString(),
   admin_email: env.get("ADMIN_EMAIL").asString(),

   
}

export default envConfig


