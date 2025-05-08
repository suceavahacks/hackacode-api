import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiSecure } from '../auth/decorators/api-secure.decorator';

@ApiTags('problems')
@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}
  
  @Get()
  @ApiSecure()
  @ApiOperation({ summary: 'Get all problems' })
  @ApiResponse({ status: 200, description: 'Returns all problems' })
  findAll() {
    return this.problemsService.findAll();
  }

  @Get(':id')
  @ApiSecure()
  @ApiOperation({ summary: 'Get a specific problem by ID' })
  @ApiResponse({ status: 200, description: 'Returns a problem' })
  @ApiResponse({ status: 404, description: 'Problem not found' })
  findOne(@Param('id') id: string) {
    return this.problemsService.findOne(+id);
  }

}
