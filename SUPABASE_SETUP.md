# Supabase Configuration Guide for Visa Score Platform

This guide covers the essential Supabase configuration needed to run the Visa Score platform with full functionality.

## Required Supabase Configuration

### 1. Authentication Settings

#### Email Configuration
Go to **Authentication > Settings** in your Supabase dashboard:

1. **Site URL**: Set to your domain (e.g., `https://yourdomain.com`)
2. **Redirect URLs**: Add the following URLs:
   ```
   https://yourdomain.com/reset-password
   https://yourdomain.com
   http://localhost:3000/reset-password (for development)
   http://localhost:3000 (for development)
   ```

#### Email Templates
Go to **Authentication > Email Templates**:

1. **Confirm Signup Template**:
   - Subject: `Confirm your Visa Score account`
   - Message: Update to include your branding and redirect to your domain

2. **Reset Password Template**:
   - Subject: `Reset your Visa Score password`
   - Message: Ensure the reset link points to `{{ .SiteURL }}/reset-password`

#### Password Reset Flow
The platform uses Supabase's built-in password reset flow:
- Users click "Forgot Password" → Email sent with reset link
- Reset link format: `https://yourdomain.com/reset-password?access_token=xxx&refresh_token=xxx&type=recovery`
- The `/reset-password` page handles the token validation and password update

### 2. Social Authentication (Optional)

#### Google OAuth Setup
If you want to enable Google sign-in:

1. Go to **Authentication > Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. **Authorized JavaScript origins**: Add your domain
5. **Authorized redirect URIs**: Add your Supabase auth callback URL

**Google Cloud Console Setup**:
1. Create a project at https://console.cloud.google.com
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add your domain to authorized origins
5. Add Supabase callback URL to authorized redirect URIs

### 3. SMS/Phone Authentication (Optional)

#### Twilio Integration
For phone number authentication:

1. Go to **Authentication > Providers**
2. Enable **Phone** provider
3. Configure SMS provider (Twilio recommended):
   - **Account SID**: From Twilio dashboard
   - **Auth Token**: From Twilio dashboard
   - **Phone Number**: Your Twilio phone number

**Note**: Without SMS configuration, phone authentication will show appropriate error messages directing users to email/Google auth.

### 4. Database Configuration

The platform uses a simple key-value store approach with the existing `kv_store_ca272e8b` table. No additional database setup is required.

### 5. Edge Functions

The following Supabase Edge Functions are already configured:
- `/supabase/functions/server/index.tsx` - Main server with all endpoints
- Uses Deno runtime with proper CORS headers

### 6. Storage (Optional)

If you plan to add file upload features:

1. Go to **Storage**
2. Create buckets as needed
3. Set up proper RLS policies for security

### 7. Environment Variables

Ensure these environment variables are set in your Supabase project:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (keep secret!)
```

## Security Considerations

### 1. Row Level Security (RLS)
The platform uses a simple KV store approach, but if you expand the database:
- Enable RLS on all tables
- Create policies for user data access
- Ensure users can only access their own data

### 2. API Rate Limiting
Supabase provides built-in rate limiting for:
- Authentication endpoints
- Database queries
- Edge function calls

### 3. CORS Configuration
The Edge Functions are configured with open CORS headers for development. For production:
- Restrict CORS to your specific domain
- Use environment variables for domain configuration

## Testing Configuration

### Development Setup
1. Use `http://localhost:3000` as your Site URL during development
2. Add localhost URLs to redirect URIs
3. Test all authentication flows before deploying

### Production Checklist
- [ ] Update Site URL to production domain
- [ ] Update redirect URLs to production domain
- [ ] Configure custom SMTP for email delivery (optional)
- [ ] Set up custom domain for Supabase project (optional)
- [ ] Review and tighten security policies
- [ ] Test password reset flow end-to-end
- [ ] Test OAuth providers if enabled
- [ ] Test phone authentication if enabled

## Common Issues & Solutions

### Password Reset Not Working
1. Check that redirect URLs include `/reset-password`
2. Verify email template uses correct redirect URL
3. Ensure `type=recovery` parameter is handled correctly

### OAuth Redirect Issues
1. Verify Google Cloud Console redirect URIs
2. Check Supabase OAuth provider configuration
3. Ensure Site URL matches your domain exactly

### Email Delivery Issues
1. Check Supabase email logs in dashboard
2. Consider setting up custom SMTP provider
3. Check spam folders during testing

### Phone Authentication Issues
1. Verify Twilio credentials
2. Check phone number format validation
3. Ensure SMS provider is properly configured

## Support

For additional help:
- Supabase Documentation: https://supabase.io/docs
- Supabase Community: https://github.com/supabase/supabase/discussions
- Platform-specific issues: Check the application logs and error messages