# Supabase Email Sign-Up Verification Setup Guide

This guide provides step-by-step instructions to enable email verification for user sign-ups in your Supabase project.

## Prerequisites
- Supabase project already created
- Access to Supabase Dashboard
- Email provider configuration (optional, but recommended for production)

## Step 1: Access Authentication Settings

1. **Log in to Supabase Dashboard**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign in to your account
   - Select your project

2. **Navigate to Authentication**
   - In the left sidebar, click on **"Authentication"**
   - Click on **"Settings"** (usually the last item in the Authentication submenu)

## Step 2: Configure Email Confirmation

1. **Find Email Settings Section**
   - Scroll down to find the **"Email"** section
   - Look for **"Confirm email"** setting

2. **Enable Email Confirmation**
   - Toggle **"Confirm email"** to **ON/Enabled**
   - This requires users to verify their email before they can sign in

3. **Set Email Confirmation Redirect URL**
   - Set the **"Site URL"** to your application's URL (e.g., `https://yourdomain.com` or `http://localhost:3000` for development)
   - Add additional redirect URLs if needed in **"Additional Redirect URLs"**

## Step 3: Configure Email Templates (Optional)

1. **Access Email Templates**
   - In the Authentication settings, find **"Email Templates"**
   - Click on **"Confirmation"** template

2. **Customize Confirmation Email**
   - Modify the subject line and email content as needed
   - Use variables like `{{ .Email }}`, `{{ .ConfirmationURL }}`, etc.
   - Preview your changes

## Step 4: Set Up Email Provider (Recommended for Production)

### Option A: Use Supabase's Default SMTP (Development Only)
- Supabase provides a default SMTP for testing
- Limited to 3 emails per hour
- Not recommended for production

### Option B: Configure Custom SMTP Provider

1. **Go to SMTP Settings**
   - In Authentication > Settings, find **"SMTP Settings"**

2. **Choose an Email Provider**
   Popular options:
   - **SendGrid**
   - **Mailgun** 
   - **AWS SES**
   - **Postmark**
   - **Gmail SMTP** (for testing only)

3. **Configure SMTP Settings**
   ```
   SMTP Host: [Your provider's SMTP host]
   SMTP Port: [Usually 587 or 465]
   SMTP User: [Your SMTP username]
   SMTP Pass: [Your SMTP password]
   SMTP From: [Your verified sender email]
   ```

## Step 5: Update Your Application Code

### Current Authentication Flow Update

Your current code in `App.tsx` uses Google OAuth, but if you want to add email/password signup with verification, you'll need to modify the authentication handlers.

#### Add Email Signup Function

```tsx
const handleEmailSignUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      console.error('Sign up error:', error);
      toast.error('Failed to sign up. Please try again.');
      return { success: false, error };
    }

    if (data.user && !data.user.email_confirmed_at) {
      toast.success('Please check your email to confirm your account!');
      return { success: true, needsConfirmation: true };
    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Sign up error:', error);
    toast.error('Failed to sign up. Please try again.');
    return { success: false, error };
  }
};
```

#### Add Email Confirmation Handler

```tsx
// Add this to handle the email confirmation callback
useEffect(() => {
  // Handle email confirmation
  const { data: authListener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('User confirmed email and signed in');
        toast.success('Email confirmed successfully!');
        // Handle successful email confirmation
      }
    }
  );

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);
```

## Step 6: Test Email Verification

### Development Testing

1. **Test with Development URL**
   - Set Site URL to `http://localhost:3000` or your dev URL
   - Create a test user account
   - Check if confirmation email is sent

2. **Check Email Delivery**
   - Look in your email inbox (and spam folder)
   - Click the confirmation link
   - Verify user gets redirected properly

### Production Testing

1. **Update Production URLs**
   - Set Site URL to your production domain
   - Test with real email addresses
   - Monitor email delivery rates

## Step 7: Advanced Configuration

### Rate Limiting
- Configure rate limiting in Authentication > Settings
- Set appropriate limits for sign-up attempts

### Email Rate Limiting
- Set limits on confirmation email resends
- Configure cooldown periods

### Custom Email Templates
- Create branded email templates
- Use your company's design and messaging
- Test across different email clients

## Step 8: Monitoring and Troubleshooting

### Common Issues

1. **Emails Not Sending**
   - Check SMTP configuration
   - Verify sender email is authenticated
   - Check email provider logs

2. **Confirmation Links Not Working**
   - Verify Site URL configuration
   - Check redirect URL settings
   - Ensure HTTPS in production

3. **Users Not Getting Confirmed**
   - Check email template variables
   - Verify confirmation URL format
   - Test email delivery

### Monitoring Tools
- Check Supabase Dashboard > Authentication > Users
- Monitor email delivery in your email provider dashboard
- Use Supabase logs for debugging

## Example Environment Variables

If you're using environment variables for configuration:

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Configuration (if using custom SMTP)
SMTP_HOST=smtp.yourmailprovider.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@yourdomain.com
```

## Security Best Practices

1. **Use HTTPS in Production**
   - Ensure all redirect URLs use HTTPS
   - Secure email confirmation links

2. **Set Appropriate Rate Limits**
   - Prevent abuse of signup endpoints
   - Limit email confirmation requests

3. **Validate Email Addresses**
   - Implement client-side email validation
   - Use server-side validation as well

4. **Monitor Authentication Events**
   - Set up logging for failed attempts
   - Monitor for suspicious activity

## Support and Resources

- **Supabase Documentation**: [https://supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)
- **Email Templates Guide**: [https://supabase.com/docs/guides/auth/auth-email-templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- **SMTP Setup Guide**: [https://supabase.com/docs/guides/auth/auth-smtp](https://supabase.com/docs/guides/auth/auth-smtp)

---

This setup will ensure that users must verify their email addresses before they can access your Visa Score application, adding an important security layer to your authentication system.