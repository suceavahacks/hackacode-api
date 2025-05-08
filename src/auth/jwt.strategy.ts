import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly supabaseService: SupabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    try {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      // Set the auth token for the Supabase client
      await this.supabaseService.setAuthToken(token);
      
      // Get the user after setting the token
      const { data, error } = await this.supabaseService.getClient().auth.getUser();
      
      if (error || !data.user) {
        throw new UnauthorizedException('Invalid token');
      }
      
      return data.user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 