# Google OAuth Setup Instructions

## Prerequisites
1. A Google Cloud Console account
2. A Google Cloud Project

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen if prompted
6. Choose "Web application" as the application type
7. Add authorized origins:
   - `http://localhost:3000` (for development)
   - `http://localhost:4173` (for Vite preview)
   - Your production domain
8. Add authorized redirect URIs:
   - `http://localhost:3000`
   - `http://localhost:4173`
   - Your production domain
9. Click "Create"
10. Copy the Client ID and API Key

## Step 2: Configure Environment Variables

Create a `.env` file in your project root and add:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

## Step 3: Update Google Auth Service

In `src/services/googleAuth.js`, replace the placeholder values:

```javascript
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || 'YOUR_GOOGLE_API_KEY_HERE';
```

## Step 4: Backend Integration (Optional)

If you have a backend, implement the Google OAuth endpoint:

```python
# Flask example
@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    # Verify Google token and create/update user
    # Return JWT token and user data
    pass
```

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Go to the login page
3. Click "Continue with Google"
4. Complete the OAuth flow

## Troubleshooting

- **"Invalid origin" error**: Make sure your domain is added to authorized origins
- **"Access blocked" error**: Check that your OAuth consent screen is configured
- **Demo mode fallback**: If Google auth fails, the app will use demo mode automatically

## Security Notes

- Never commit your actual Client ID and API Key to version control
- Use environment variables for all sensitive configuration
- Regularly rotate your OAuth credentials
- Monitor your Google Cloud Console for unusual activity