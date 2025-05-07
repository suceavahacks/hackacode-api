import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) { }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabaseService.getClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return {
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    };
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabaseService.getClient().auth.signUp({
      email,
      password,
    });
    if (error) {
      throw new UnauthorizedException(error.message);
    }
    return {
      user: data.user,
      session: data.session ? {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      } : null
    };
  }

  async signOut() {
    const { error } = await this.supabaseService.getClient().auth.signOut();
    if (error) {
      throw new UnauthorizedException(error.message);
    }
    return { success: true };
  }

  async getUser() {
    const { data, error } = await this.supabaseService.getClient().auth.getUser();
    if (error) {
      throw new UnauthorizedException(error.message);
    }
    return { user: data.user };
  }

  async refreshToken(refreshToken: string) {
    const { data, error } = await this.supabaseService.getClient().auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    if (!data.session) {
      throw new UnauthorizedException('Session refresh failed');
    }

    return {
      user: data.user,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    };
  }
}
