
import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { CreateChannelRequest, CreateCommunityRequest } from './community.dto';
import { CommunityService } from './community.service';
import { Channel } from './models';

@Controller("community")
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get("auth")
  async getAuth(@Body() getAuthRequest: {address: string, message: string}) {
    return {
        "token": this.communityService.getAuthToken(getAuthRequest.message, getAuthRequest.address)
    }
  }

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
  async addChannel(@Param("id") id: string, @Body() createChannelRequest: CreateChannelRequest, @Headers() headers) {
    //TODO check if user is admin of community
    const user = await this.communityService.validateToken(headers["auth-token"] as string)
    this.communityService.validateAdmin(id,user.id)
    return await this.communityService.createChannel(createChannelRequest.name, createChannelRequest.type, createChannelRequest.image, createChannelRequest.filter, id)
  }

  @Get(":communityId/channels")
  async getAllChannels(@Param("communityId") communityId: string, @Headers() headers ): Promise<Channel[]>{
    // TODO check if user is member of community or not
    const user = await this.communityService.validateToken(headers["auth-token"] as string)
    return await this.communityService.getChannels(communityId, user)
  }


  @Get(":communityId/channels/:channelId/messages")
  async getAllMessages(@Param("communityId") communityId: string, @Param("channelId") channelId) {
    const messages = await 
  }
}
