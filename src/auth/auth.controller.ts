import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signupDto';
import { SigninDto } from './dto/SigninDto';
import { resetPasswordDto } from './dto/resetPasswordDto';
import { resetPasswordConfirmationDto } from './dto/resetPasswordConfirmationDto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { deleteAccountDto } from './dto/deleteAccountDto';
import { ApiBearerAuth, ApiTags, } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}
    
    @Post('register')
    register(@Body() body: SignupDto) {
        return this.authService.register(body) ;
    }

    @Post('login')
    login(@Body() body: SigninDto) {
        return this.authService.login(body) ;
    }

    @ApiBearerAuth()
    @Post('reset-password')
    resetPassword(@Body() body: resetPasswordDto) {
        //const {email} = body;
        return this.authService.resetPassword(body.email);
    }

    @Post('reset-password-confirmation')
    resetPasswordConfirmation(@Body() body: resetPasswordConfirmationDto) {
        //const {email} = body;
        return this.authService.resetPasswordConfirmation(body);
    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete('delete')
    deleteAccount(@Req() req: Request,@Body() DeleteAccountDto: deleteAccountDto) {
        const userId = req.user?.["userId"];
        return this.authService.deleteAccount(userId,DeleteAccountDto);
    }
}
