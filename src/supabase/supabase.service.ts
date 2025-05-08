import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private clientInstance: SupabaseClient | null = null;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    if (supabaseUrl && supabaseAnonKey) {
      try {
        this.clientInstance = createClient(supabaseUrl, supabaseAnonKey);
        this.logger.log('Supabase initialized successfully');
      } catch (error) {
        this.logger.error('Failed to initialize Supabase client', error);
        this.clientInstance = null;
      }
    } else {
      this.logger.warn('Supabase URL or key is not set. Some features may be unavailable.');
      this.logger.warn('Set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file to enable Supabase integration.');
    }
  }

  getClient(): SupabaseClient {
    if (!this.clientInstance) {
      throw new Error('Supabase client is not initialized. Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in your .env file!!!!!!!');
    }
    return this.clientInstance;
  }

  isInitialized(): boolean {
    return this.clientInstance !== null;
  }

  async setAuthToken(token: string): Promise<void> {
    if (!this.clientInstance) {
      throw new Error('Supabase client is not initialized');
    }
    
    try {
      const { error } = await this.clientInstance.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
      
      if (error) {
        this.logger.error('Error setting auth token', error);
      }
    } catch (error) {
      this.logger.error('Failed to set auth token', error);
    }
  }
} 