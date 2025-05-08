import { Injectable } from '@nestjs/common';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { SupabaseService } from '../supabase/supabase.service';
/*
TODO : add testcases table , so each problem can have multiple testcases but they'll be separate from the problem statement.
*/
@Injectable()
export class ProblemsService {
  constructor(private readonly supabaseService: SupabaseService) {}
  async findAll() {
    const {data,error} = await this.supabaseService.getClient().from('problems').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async findOne(id: number) {
    const {data,error} = await this.supabaseService.getClient().from('problems').select('*').eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

}
