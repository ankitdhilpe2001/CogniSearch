import nodemailer from "nodemailer";

//transporter is the object responsible for actually connecting to an email service and sending emails 📧
// without transporter nodemailer doesn't know which email service to use, how to authenticate, where to send the from
// A transporter is a Nodemailer object that connects your backend application to an SMTP server so emails can be sent 📧

async function getAccessToken() {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        grant_type: "refresh_token",
    });

    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok || !data.access_token) {
        throw new Error(
            data.error_description || "Failed to obtain Gmail access token"
        );
    }

    return data.access_token;
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
});

transporter
    .verify()
    .then(() => console.log("Email transporter is ready to send emails"))
    .catch((err) =>
        console.error("Email transporter verification failed:", err.message)
    );

export async function sendEmail({ to, subject, html, text }) {
    const accessToken = await getAccessToken();

    const mailOptions = {
        from: `"Perplexity" <${process.env.GOOGLE_USER}>`,
        to,
        subject,
        html,
        text,
        auth: {
            type: "OAuth2",
            user: process.env.GOOGLE_USER,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken,
        },
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
}
