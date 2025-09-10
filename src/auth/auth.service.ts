import {ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signupDto';
import { MailerService } from 'src/mailer/mailer.service';
import { SigninDto } from './dto/SigninDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as speakeasy from 'speakeasy';
import { resetPasswordConfirmationDto } from './dto/resetPasswordConfirmationDto';
import { deleteAccountDto } from './dto/deleteAccountDto';


@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService,
        private readonly mailerService: MailerService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async register(registerDto: SignupDto) {
        const {email, password, username} = registerDto;
        // verifier si l'utilisateur existe deja
        const user = await this.prismaService.user.findUnique({
            where: {
                email: email
            }
        })
        if(user) {
            throw new ConflictException('User already exists');
        }
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        // Enregistrer l'utilisateur dans la bd
        const newUser = await this.prismaService.user.create({
            data: {
                email: email,
                password: hashedPassword,
                username: username
            }
        })
        // envoyer un mail de confirmation
        await this.mailerService.sendConfirmationEmail(email);

        // retourner une reponse de succès
        return {
            message: 'User created successfully',
            user: newUser
        }

    }

    async login(registerDto: SigninDto){
        const {email, password} = registerDto;
        // verifier si l'utilisateur est deja inscrit
        const user = await this.prismaService.user.findUnique({
            where: {
                email: email
            }
        })
        if(!user) {
            throw new NotFoundException('User not found');
        }
        // comparer le mot d passe
       const isPasswordValid = await bcrypt.compare(password, user.password);
       if(!isPasswordValid) {
           throw new UnauthorizedException('Invalid credentials');
       }
        // retourner un token jwt
        const payload = {
            sub: user.userId,
            email: user.email
        }
        const token = this.jwtService.sign(payload,{
            expiresIn: '1h',
            secret: this.configService.get('SECRET_KEY')
        });
        return {
            message: 'User logged in successfully',
            username: user.username,
            email: user.email,
            token: token
        }
    }
    
    async resetPassword (email: string){
        const user  = await this.prismaService.user.findUnique({
            where: {
                email: email
            }
        })
        if(!user) {
            throw new NotFoundException('User not found');
        }
        const secret = this.configService.get<string>('ODT_SECRET');
        if (!secret) {
            throw new Error('ODT_SECRET is not defined in environment variables');
        }
        const code = speakeasy.totp({
            secret: secret,
            encoding: 'base32',
            digits: 6,
            step: 60 * 15,
            //period: 30
        })
        const url = "http://localhost:3000/auth/reset-password-confirmation";
        await this.mailerService.sendResetPasswordEmail(email, url, code);
        return {
            message: 'Reset password email sent successfully',
            email: email
        }
    }

    async resetPasswordConfirmation(resetPasswordConfirmationDto: resetPasswordConfirmationDto){
        const {email, password, code} = resetPasswordConfirmationDto;
        const user = await this.prismaService.user.findUnique({
            where: {
                email: email
            }
        })
        if(!user) {
            throw new NotFoundException('User not found');
        }
       const match = speakeasy.totp.verify({
            secret: this.configService.get<string>('ODT_SECRET') || '',
            token: code,
            digits: 6,
            step: 60 * 15,
            //period: 30
            encoding: 'base32', 
        })
        if(!match) {
            throw new UnauthorizedException('Invalid code/Expired code');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.prismaService.user.update({
            where: {
                email: email
            },
            data: {
                password: hashedPassword
            }
        })
        return {
            message: 'Password reset successfully',
            email: email
        }
    }
    
    async deleteAccount(userId: number, deleteAccountDto: deleteAccountDto){
        const {password} = deleteAccountDto;
        const user = await this.prismaService.user.findUnique({
            where: {
                userId: Number(userId)
            }
        })
        if(!user) {
            throw new NotFoundException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }
        await this.prismaService.user.delete({
            where: {
                userId: Number(userId)
            }
        })
        return {
            message: 'User deleted successfully',
            user: user
        }
    }
}
