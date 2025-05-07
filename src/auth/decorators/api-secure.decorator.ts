import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth.guard';
export function ApiSecure() {
  console.log('ApiSecure called :speaking_head:');
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiBearerAuth('access-token'),
    ApiUnauthorizedResponse({ description: 'Unauthorized' })
  );
}
