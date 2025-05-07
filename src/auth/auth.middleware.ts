import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SupabaseAuthMiddleware implements NestMiddleware {
  constructor(private readonly supabaseService: SupabaseService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Extract token from request headers
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      // Set the auth token for the Supabase client
      this.supabaseService.setAuthToken(token)
        .catch(error => {
          console.error('Failed to set auth token:', error);
        });
    }
    
    next();
  }
} 