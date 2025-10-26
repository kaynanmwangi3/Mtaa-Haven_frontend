import { gapi } from 'gapi-script';

// Google OAuth2 configuration
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE'; // Replace with your actual Google Client ID
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || 'YOUR_GOOGLE_API_KEY_HERE'; // Replace with your actual Google API Key
const SCOPES = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

class GoogleAuthService {
  constructor() {
    this.isInitialized = false;
    this.authInstance = null;
  }

  // Initialize Google API
  async initialize() {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      gapi.load('auth2', async () => {
        try {
          await gapi.auth2.init({
            client_id: CLIENT_ID,
            scope: SCOPES,
            apiKey: API_KEY
          });

          this.authInstance = gapi.auth2.getAuthInstance();
          this.isInitialized = true;
          resolve();
        } catch (error) {
          console.error('Google Auth initialization failed:', error);
          reject(error);
        }
      });
    });
  }

  // Sign in with Google
  async signIn() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const googleUser = await this.authInstance.signIn({
        prompt: 'select_account'
      });

      const profile = googleUser.getBasicProfile();
      const authResponse = googleUser.getAuthResponse();

      const userData = {
        id: profile.getId(),
        email: profile.getEmail(),
        first_name: profile.getGivenName(),
        last_name: profile.getFamilyName(),
        full_name: profile.getName(),
        image_url: profile.getImageUrl(),
        provider: 'google',
        access_token: authResponse.access_token,
        id_token: authResponse.id_token
      };

      return userData;
    } catch (error) {
      console.error('Google sign in failed:', error);
      throw error;
    }
  }

  // Sign out from Google
  async signOut() {
    try {
      if (this.authInstance) {
        await this.authInstance.signOut();
      }
    } catch (error) {
      console.error('Google sign out failed:', error);
      throw error;
    }
  }

  // Check if user is signed in
  isSignedIn() {
    return this.authInstance && this.authInstance.isSignedIn.get();
  }

  // Get current user
  getCurrentUser() {
    if (this.isSignedIn()) {
      const googleUser = this.authInstance.currentUser.get();
      const profile = googleUser.getBasicProfile();

      return {
        id: profile.getId(),
        email: profile.getEmail(),
        first_name: profile.getGivenName(),
        last_name: profile.getFamilyName(),
        full_name: profile.getName(),
        image_url: profile.getImageUrl(),
        provider: 'google'
      };
    }
    return null;
  }

  // Listen for auth state changes
  listen(callback) {
    if (this.authInstance) {
      this.authInstance.isSignedIn.listen(callback);
    }
  }
}

export const googleAuth = new GoogleAuthService();
export default googleAuth;