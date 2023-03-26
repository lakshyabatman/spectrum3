
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateChannelRequest, CreateCommunityRequest } from './community.dto';
import { CommunityService } from './community.service';

@Controller("community")
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}


  @Get()
  async getCommunities() {
    return await this.communityService.getAllCommunities()
  }


  @Get(":id")
  async getCommunityById(@Param('id') id: string) {
    return await this.communityService.getCommunity(id)
  }
  
  @Post()
  async createCommunity(@Body() createCommunityRequest: CreateCommunityRequest) {
    //TODO check if admin is owner of nftContract
    return await this.communityService.createCommunity(createCommunityRequest.name, createCommunityRequest.description, createCommunityRequest.admin, createCommunityRequest.image, createCommunityRequest.nftContract);
  }

  @Post(":id/addChannel")
  async addChannel(@Param("id") id: string, @Body() createChannelRequest: CreateChannelRequest) {
    //TODO check if user is admin of community
    return await this.communityService.createChannel(createChannelRequest.name, createChannelRequest.type, createChannelRequest.image, createChannelRequest.filter, id)
  }
}
