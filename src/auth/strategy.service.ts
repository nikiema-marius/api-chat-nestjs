import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

type Payload = {
    sub: string;
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService, private readonly prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('SECRET_KEY') || '',
            ignoreExpiration: false, // si le token est expiré, on le rejet
        })
    }
   async validate(payload: Payload) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email
            }
        })
        if(!user) {
            throw new UnauthorizedException('User not found');
        }
        console.log(user);
        Reflect.deleteProperty(user, 'password');
        return user; // on retourne le payload qui contient le userId et l'email
    }

}