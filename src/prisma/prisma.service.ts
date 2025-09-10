import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(configSevice: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configSevice.get('DATABASE_URL'),
                },
            },
        });
    }
}
