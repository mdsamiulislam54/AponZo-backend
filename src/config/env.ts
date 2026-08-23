 import "dotenv/config";
 import env from "env-var"

 const envConfig = {
    env:env.get("NODE_ENV").default("development").asString(),
    port:env.get("PORT").default("8080").asString(),
    databaseUrl: env.get("DB_URL").required().asString()
 }

 export default envConfig


