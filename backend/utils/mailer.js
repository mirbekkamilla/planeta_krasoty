import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_SMTP_KEY,
    }
})

export const sendMail = async ({ to, subject, html }) => {
    await transporter.sendMail({
        from: `"Планета Красоты" <${process.env.BREVO_EMAIL}>`,
        to,
        subject,
        html
    })
}
