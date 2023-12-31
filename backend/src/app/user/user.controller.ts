import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { catchError, lastValueFrom, take } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AccessToken } from '../../common/decorators/access-token.decorator';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { AuthGuard } from '../../common/guards/auth.guard';
import { IsNotDeviceGuard } from '../../common/guards/is-not-device.guard';
import { AccessTokenData } from '../../common/interfaces/access-token.type';
import { UserEntity } from '../../models';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@UseGuards(IsNotDeviceGuard)
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ schema: { $ref: getSchemaPath(UserEntity) } })
  public getUser(@AccessToken() accessToken: AccessTokenData): Promise<UserEntity> {
    return lastValueFrom(
      this.userService.getUserById(accessToken.sub).pipe(
        take(1),
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Get(':userId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'userId', format: 'uuid' })
  @ApiOkResponse({ type: UserEntity })
  public getUserById(@Param('userId', new ParseUUIDPipe()) userId: string): Promise<UserEntity> {
    return lastValueFrom(
      this.userService.getUserById(userId).pipe(
        take(1),
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBody({ type: UpdateUserDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  public updateUser(@AccessToken() accessToken: AccessTokenData, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return lastValueFrom(
      this.userService.updateUser(accessToken.sub, updateUserDto).pipe(
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
        take(1),
      ),
    );
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public deleteUser(@AccessToken() accessToken: AccessTokenData): Promise<DeleteResult> {
    return lastValueFrom(
      this.userService.deleteUser(accessToken.sub).pipe(
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
        take(1),
      ),
    );
  }
}
