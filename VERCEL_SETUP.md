# Vercel Deployment Setup

This project is configured to work with Vercel's PHP runtime.

## Environment Variables

Set these in your Vercel project settings:

1. **CONTACT_FROM_EMAIL** - Email address to send from (e.g., `info@snchz.co`)
2. **CONTACT_TO_EMAIL** - Email address to receive contact form submissions
3. **RECAPTCHA_SECRET_KEY** - Your Google reCAPTCHA v2 secret key

## Getting reCAPTCHA Keys

1. Go to https://www.google.com/recaptcha/admin
2. Create a new site (reCAPTCHA v2)
3. Add your domain (e.g., `snchz.co` and `*.vercel.app` for testing)
4. Copy the Site Key and Secret Key
5. Update `index.html` line 1097 with your Site Key
6. Add Secret Key to Vercel environment variables

## Email Configuration

**Important:** The PHP `mail()` function may not work reliably on Vercel. Consider using:

- **Resend** (recommended for Vercel)
- **SendGrid**
- **Mailgun**
- **AWS SES**

You can update `api/contact.php` to use one of these services instead of the `mail()` function.

## Deployment Steps

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The contact form will be available at `/api/contact`

