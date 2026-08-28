import status from "http-status";
import envConfig from "../config/env";
import { AppError } from "../middlewares/appErrors";
import path from "path";
import ejs from "ejs";
import { transporter } from "../lib/nodemailer";


interface SendEmailOptions {
    to: string;
    subject: string;
    templateName: string;
    templateData: Record<string, string | number | boolean | object>;
    attachments?: {
        filename: string;
        content: Buffer | string;
        contentType: string;
    }[];
}


export const sendEmail = async ({ subject, templateData, templateName, to, attachments, }: SendEmailOptions) => {
    try {
        const templatePath = path.resolve(process.cwd(),`src/template/${templateName}.ejs`);
       
        const td = templateData as Record<string, unknown>;
    
        const expiresVal =
            td && Object.prototype.hasOwnProperty.call(td, "expiresInMinutes")
                ? td["expiresInMinutes"]
                : undefined;


        const expiresInMinutes = typeof expiresVal === "number" ? expiresVal : 5;
        const templateDataWithDefaults: Record<string, unknown> = {
            appName: envConfig.app_name,
            supportEmail: envConfig.admin_email,
            year: new Date().getFullYear(),
            expiresInMinutes,
            ...td,
        };
        const html = await ejs.renderFile(templatePath, templateDataWithDefaults);
   
        await transporter.sendMail({
            from: envConfig.email_from,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map((attachment) => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType,
            })),
        });

    } catch (error) {
        console.error(error);
        throw new AppError(status.INTERNAL_SERVER_ERROR, `Failed to send email to ${to}`);
    }
}