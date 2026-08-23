
import app from "./app"
import envConfig from "./config/env"
const port = envConfig.port
const bootstrap = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server is running in ${port}`)
        })
    } catch (error) {
        console.log("Server running failed!")
        console.error(error)
    }
}

bootstrap()
