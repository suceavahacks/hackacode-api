import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) { }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
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
