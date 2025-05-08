import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { SupabaseAuthMiddleware } from './auth.middleware';
import { AuthGuard } from './auth.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SupabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthGuard],
  exports: [JwtStrategy, PassportModule, AuthService, AuthGuard, SupabaseModule],
})
export class AuthModule {
  /*
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SupabaseAuthMiddleware)
      .forRoutes('*');
  }
  */
}
