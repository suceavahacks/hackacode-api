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

  @Post()
  @ApiSecure()
  @ApiOperation({ summary: 'Create a new problem' })
  @ApiResponse({ status: 201, description: 'Problem created successfully' })
  create(@Body() createProblemDto: CreateProblemDto) {
    return this.problemsService.create(createProblemDto);
  }

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

  @Patch(':id')
  @ApiSecure()
  @ApiOperation({ summary: 'Update a problem' })
  @ApiResponse({ status: 200, description: 'Problem updated successfully' })
  @ApiResponse({ status: 404, description: 'Problem not found' })
  update(@Param('id') id: string, @Body() updateProblemDto: UpdateProblemDto) {
    return this.problemsService.update(+id, updateProblemDto);
  }

  @Delete(':id')
  @ApiSecure()
  @ApiOperation({ summary: 'Delete a problem' })
  @ApiResponse({ status: 200, description: 'Problem deleted successfully' })
  @ApiResponse({ status: 404, description: 'Problem not found' })
  remove(@Param('id') id: string) {
    return this.problemsService.remove(+id);
  }
}
