import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) { }
  
  async create(createUserDto: CreateUserDto) {
    const { id, bio } = createUserDto;
    
    // Check if user already exists in public.users
    const { data: existingUser, error: checkError } = await this.supabaseService.getClient()
      .from('users')
      .select('id')
      .eq('id', id)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error(`Error checking for existing user: ${checkError.message}`);
    }
    
    if (existingUser) {
      return existingUser; // User already exists, return it
    }
    
    // Insert user into public.users table
    const { data, error } = await this.supabaseService.getClient()
      .from('users')
      .insert({
        id,
        bio: bio || null
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
    
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService.getClient().from('users').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async findOne(id: string) {
    
    const {data,error} = await this.supabaseService.getClient().from('users').select('*').eq('id', id);
    if (error) {
      if(error.code === '22P02') {
        return {};
      }
      throw new Error(error.message);
    }
    return data;
  }
}
