import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) { }

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

    // Create user in public.users table if signup successful
    if (data.user) {
      try {
        await this.usersService.create({
          id: data.user.id,
          bio: undefined
        });
      } catch (err) {
        console.error('Error creating user in public.users table:', err);
        // Continue with auth signup even if public.users creation fails
      }
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
//so locked in I cant believe it
  async initiateGoogleAuth() {
    try {
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      console.log(`here's ur frontend url : ${frontendUrl}`);
      if (!frontendUrl) {
        throw new BadRequestException('FRONTEND_URL environment variable is not set bruh');
      }
      
      const state = Math.random().toString(36).substring(2, 15);
      
      const { data, error } = await this.supabaseService.getClient().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${frontendUrl}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            response_type: 'code',
            prompt: 'consent'
          },
        },
      });

      if (error) {
        throw new UnauthorizedException(error.message);
      }

      
      return {
        url: data.url,
        state,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to initiate google auth: ${error.message}`);
    }
  }

  async handleGoogleCallback(code: string, state: string) {
    try {
      const { data, error } = await this.supabaseService.getClient().auth.getSession();
      
      if (error) {
        throw new UnauthorizedException(error.message);
      }
      
      if (!data.session) {
        throw new UnauthorizedException('No session found. The OAuth flow might not be complete.');
      }
      
      const userResponse = await this.supabaseService.getClient().auth.getUser();
      
      // Create user in public.users table if not exists
      if (userResponse.data.user) {
        try {
          await this.usersService.create({
            id: userResponse.data.user.id,
            bio: undefined
          });
        } catch (err) {
          console.error('Error creating user in public.users table for Google auth:', err);
          // Continue with auth flow even if public.users creation fails
        }
      }

      return {
        user: userResponse.data.user,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        }
      };
    } catch (error) {
      throw new BadRequestException(`Failed to complete Google authentication: ${error.message}`);
    }
  }
}
