 import "dotenv/config";
 import env from "env-var"

 const envConfig = {
    env:env.get("NODE_ENV").default("development").asString(),
    port:env.get("PORT").default("8080").asString(),
    databaseUrl: env.get("DATABASE_URL").required().asString(),
    auth_secret: env.get("BETTER_AUTH_SECRET").asString(),
    auth_url: env.get("BETTER_AUTH_URL").asString()
 }

 export default envConfig


