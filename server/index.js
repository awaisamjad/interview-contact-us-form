const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.email,
        pass: process.env.password,
    },
});

// Rate Limiter is used to prevent attacks such as DDoS etc 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1, // Limit each IP to 10 requests per `window` therefore 10 requests per 15 minutes
});

const app = express();

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.json());
app.use(express.static(buildPath));
app.use(limiter)
// secures app by setting HTTP response headers
app.use(helmet());

app.post('/send', (req, res) => {
    const mailOptions = {
        from: req.body.email,
        to: process.env.email,
        subject: req.body.subject,
        // Maybe use simple templating engine to take in a html file and send that
        // Can use IDE functionality
        // Table is used with inline styles as it is more consistent across email clients
        html: `
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #ddd; font-family: Arial, sans-serif;">
                <tr>
                    <td style="background-color: #007bff; color: white; padding: 20px; text-align: center; font-size: 24px;">
                        New Contact Request
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px; font-size: 16px; line-height: 1.5;">
                        <p>The Trust has received a new contact request:</p>
                        <table width="100%" cellpadding="5" cellspacing="0" border="0" style="border-collapse: collapse;">
                            <tr>
                                <td style="background-color: #f4f4f4; font-weight: bold; width: 30%;">Name:</td>
                                <td>${req.body.name}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #f4f4f4; font-weight: bold;">Email:</td>
                                <td>${req.body.email}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #f4f4f4; font-weight: bold;">Subject:</td>
                                <td>${req.body.subject}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #f4f4f4; font-weight: bold;">Message:</td>
                                <td>${req.body.message}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px;">
                        &copy; 2025 The Canal and River Trust, All rights reserved.
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
      `,
    };

    try {
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log("Send Mail Error: ", err);
                res.status(500).send({
                    success: false,
                    message: 'Something went wrong. Try again later',
                });
            } else {
                // Add a status 200 here
                res.status(200).send({
                    success: true,
                    message:
                        'Thanks for contacting us. We will get back to you shortly',
                });
            }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong. Try again later',
        });
    }
});

app.listen(3030, () => {
    console.log('Server start at: http://localhost:3030/');
});
