import { supabase } from './supabaseClient';

export const authService = {
  async signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        // Removing redirect_to for OTP flow to keep it simple
      },
    });
    return { data, error };
  },

  async verifyOTP(email, token) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup', // This must match the 'type' of verification
    });
    return { data, error };
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // 4. Logout
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
};