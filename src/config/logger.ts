import morgan from "morgan"
import envConfig from "./env"

const isProduction  = envConfig.env === "production"

const logger = morgan(isProduction ? "combined":"dev")

export {logger}
