import { gapi } from 'gapi-script';

// Google OAuth2 configuration
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-client-id'; // Replace with your actual Google Client ID
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || 'demo-api-key'; // Replace with your actual Google API Key
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

      // Check if using demo credentials
      if (CLIENT_ID === 'demo-client-id') {
        console.warn('Using demo Google auth - no real credentials configured');
        return this.getDemoGoogleUser();
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
      // Fallback to demo user if Google auth fails
      console.warn('Falling back to demo Google user');
      return this.getDemoGoogleUser();
    }
  }

  // Demo Google user for when credentials are not configured
  getDemoGoogleUser() {
    return {
      id: 'demo-google-user-' + Date.now(),
      email: 'demo.google@example.com',
      first_name: 'Demo',
      last_name: 'Google User',
      full_name: 'Demo Google User',
      image_url: 'https://via.placeholder.com/150?text=Demo+User',
      provider: 'google',
      access_token: 'demo-access-token',
      id_token: 'demo-id-token'
    };
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