require('dotenv').config();
const nodemailer = require('nodemailer');

async function testSMTPConnection() {
    console.log('🔍 Testing SMTP Connection (Port 587 - Render Compatible)...\n');

    console.log('Configuration:');
    console.log('- Host: smtp.gmail.com');
    console.log('- Port: 587 (STARTTLS)');
    console.log('- Secure: false (using STARTTLS)');
    console.log('- User:', process.env.MAIL_USER || '❌ NOT SET');
    console.log('- Pass:', process.env.MAIL_PASS ? '✅ SET (hidden)' : '❌ NOT SET');
    console.log('\n');

    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        console.error('❌ ERROR: MAIL_USER or MAIL_PASS not set in .env file');
        process.exit(1);
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use STARTTLS
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
        tls: {
            rejectUnauthorized: true
        }
    });

    try {
        console.log('🔌 Attempting to connect to SMTP server...');
        await transporter.verify();
        console.log('✅ SMTP connection successful!');
        console.log('✅ Server is ready to send emails');
        console.log('✅ This configuration works on Render!');

        // Optional: Send a test email
        console.log('\n📧 Sending test email...');
        const info = await transporter.sendMail({
            from: `"Bookoro Test" <${process.env.MAIL_USER}>`,
            to: process.env.MAIL_USER, // Send to yourself
            subject: '✅ SMTP Test (Port 587) - Bookoro',
            html: `
                <h2>SMTP Test Successful!</h2>
                <p>Your SMTP configuration is working correctly with port 587.</p>
                <p><strong>Configuration:</strong> Port 587 with STARTTLS (Render compatible)</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            `,
        });

        console.log('✅ Test email sent successfully!');
        console.log('📬 Message ID:', info.messageId);
        console.log('\n✨ All tests passed! Your email service will work on Render.');

    } catch (error) {
        console.error('❌ SMTP connection failed!');
        console.error('Error:', error.message);

        if (error.code === 'EAUTH') {
            console.error('\n💡 Authentication failed. Common solutions:');
            console.error('   1. Make sure you\'re using an App Password, not your regular Gmail password');
            console.error('   2. Enable 2-Step Verification in your Google Account');
            console.error('   3. Generate an App Password at: https://myaccount.google.com/apppasswords');
            console.error('   4. Use the App Password in your .env file as MAIL_PASS');
        } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION') {
            console.error('\n💡 Connection timeout. Check:');
            console.error('   1. Your internet connection');
            console.error('   2. Firewall settings');
            console.error('   3. Gmail SMTP is accessible from your network');
        }

        process.exit(1);
    }
}

testSMTPConnection();
