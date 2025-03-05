import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { User } from './users.entity';
import { AuthCredentialDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  createUser(@Body() authCredentialDto: AuthCredentialDto): Promise<User> {
    return this.authService.createUser(authCredentialDto);
  }
  
  @Post('/signin')
  signIn(@Body() authCredentialDto: AuthCredentialDto): Promise<{accessToken:string}> {
    return this.authService.validateUser(authCredentialDto);
  }
}
