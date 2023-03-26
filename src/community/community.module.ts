import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';

@Module({
    imports: [SharedModule],
    providers: [CommunityService],
    controllers: [CommunityController]
})
export class CommunityModule {}
