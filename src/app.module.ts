import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MeasureModule } from './endpoints/measures/measures.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';


const StaticFilesModule = ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', 'uploads'),
  exclude: ['/api/(.*)'],
})

@Module({
  imports: [PrismaModule, MeasureModule, StaticFilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
