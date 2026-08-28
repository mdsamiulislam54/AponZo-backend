
import nodemailer from "nodemailer"
import envConfig from "../config/env"
console.log(envConfig)
 export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: Number(envConfig.smtp_port),
    secure: true,
    auth: {
        user: envConfig.email_from,
        pass: envConfig.smtp_password,
    },
})


