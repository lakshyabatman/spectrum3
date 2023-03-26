import { Injectable } from "@nestjs/common";
import { SharedService } from "src/shared/shared.service";
import { Collection } from "src/utils";
import { Channel, Community, CommunityUser, Message, Pointer, UserFilter } from "./models";
import { v4 as uuidv4 } from 'uuid'


import jwt from 'jsonwebtoken'
import {verifyMessage} from 'ethers'


@Injectable()
export class CommunityService {



    constructor(private readonly sharedService: SharedService) {}


    async getCommunity(communityId: string): Promise<Community> {
        const community = await this.sharedService.db()
            .collection<Community>(Collection.COMMUNITY)
            .where("id","==", communityId)
            .get()
        return community.data[0].data
    }

    async getAllCommunities(): Promise<Community[]> {
        const community = await this.sharedService.db()
            .collection<Community>(Collection.COMMUNITY)
            .get()
        console.log(community)
        return community.data.map(it => it.data)
    }

    async createCommunity(name: string, description: string, admin: string, image: string, nftContract:string ): Promise<Community> {
        const community = await this.sharedService.db().collection<Community>(Collection.COMMUNITY).create([
            uuidv4(),
            name,
            description,
            image,
            nftContract,
            admin
        ])
        return community.data
        
    }

    async addUser(name: string, communityId: string, token: string, description: string, image: string, address: string): Promise<CommunityUser> {
        const user = await this.sharedService.db().collection<CommunityUser>(Collection.COMMUNITY_USER).create([
            uuidv4(),
            communityId,
            token,
            name,
            description,
            image,
            address
        ])
        return user.data
    }

    async createChannel(
        name: string,
        type: string,
        image: string,
        filter: UserFilter,
        communityId: string
    ): Promise<Channel> {

        // const userFilter = await this.sharedService.db()
        // .collection<UserFilter>(Collection.USER_FILTER)
        // .create([
        //     uuidv4(),
        //     filter.all,
        //     filter.nftHolder,
        //     filter.nftSmartContract,
        //     filter.rankingFilter,
        //     filter.rankingLevels
        // ])


        // let m = await this.sharedService.db().collection<UserFilter>(Collection.USER_FILTER).record(userFilter.data.id)
        const channel = await this.sharedService.db()
        .collection<Channel>(Collection.CHANNEL)
        .create([
            uuidv4(),
            communityId,
            type,
            name,
            image,
            filter.all,
            filter.nftHolder,
            filter.nftSmartContract,
            filter.rankingFilter,
            filter.rankingLevels
        ])

        let n = await this.sharedService.db()
        .collection<Channel>(Collection.CHANNEL).record(channel.data.id)


        await this.sharedService.db().collection(Collection.COMMUNITY)
            .record(communityId)
            .call('addChannel', [n])


        return channel.data;
    }

    async getChannels(
        communityId: string,
        user: string
    ): Promise<Channel[]> {
        this.getCommunityUser(communityId, user)

        const community = await this.sharedService.db()
            .collection<Community>(Collection.COMMUNITY)
            .where('id', '==', communityId)
            .get()
        if (community.data.length) {
            return Promise.all(community.data[0].data.channels
            .map(this.populateEntity<Channel>))
            
        } else {
            throw new Error("Community doesn't exist")
        }
    }


    private async populateEntity<T>(pointer: Pointer): Promise<T>{
        const record = await this.sharedService.db()
        .collection(pointer.collectionId)
        .where("id","==",pointer.id)
        .get()
        return record.data[0].data as T
    }



    async getChannel(
        communityId: string,
        channelId: string,
        user: string
    ): Promise<Channel> {
        await this.getCommunityUser(user, communityId)

        const community = await this.sharedService.db()
            .collection<Community>(Collection.COMMUNITY)
            .where('id', '==', communityId)
            .get()
        if (community.data.length) {
            return this.populateEntity<Channel>(community.data[0].data.channels.find(channel => channel.id == channelId))
        } else {
            throw new Error("Community doesn't exist")
        }
    }
    
    async getMessages(
        communityId: string,
        channelId: string,
        user: string
    ) {
        const communityUser = await this.getCommunityUser(user, communityId)
        //TODO check if user is allowed in channel
        // await validateUserAndChannel(communityUser, channelId)
        
        const content = await this.sharedService.db()
        .collection<Message>(Collection.MESSAGE)
        .where('communityId', '==', communityId)
        .where('channelId', "==", channelId)
        .get()
        return content.data
    }


    async sendMessages(
        communityId: string,
        channelId: string,
        user: string,
        content: string,
        parentId?: string
    ): Promise<Message> {
        const communityUser = await this.getCommunityUser(user, communityId)
        //TODO check if user is allowed in channel
        // await validateUserAndChannel(communityUser, channelId)
        await this.validateChannelAccess(channelId, user)
        const message = await this.sharedService.db()
        .collection<Message>(Collection.MESSAGE)
        .create([
            uuidv4(),
            channelId,
            content,
            communityId,
            parentId!!,
            parentId ?? '',
        ])

        return message.data

    }


    private async getCommunityUser(
        user: string,
        communityId: string
    ): Promise<CommunityUser>  {
        const communityUser = await this.sharedService.db()
        .collection(Collection.COMMUNITY_USER)
        .where("id","==", user)
        .where("communityId","==", communityId)
        .get();
        if(!communityUser.data.length) throw new Error("User not found")
        return communityUser.data[0].data
    }

     getAuthToken(signature: string, walletAddress: string) {
        // based on message signature we assign a token to the user
        const originalMessage  = `Login Spectrum3`;

        const signer = verifyMessage(originalMessage, signature);

        if(signer != walletAddress) {
            throw new Error("Failed to verify signature")
        }
        const token = jwt.sign({address: walletAddress}, "test-token")

        return token


    }

    validateToken (token: string) {
        const payload = jwt.verify(token,  "test-token") as {id: string};

        return payload['address'];
    }


    validateAdmin(community: Community, user: string) {

        return community.admin == user;
        // check if user is admin of community
    }


     validateChannelAccess (channelId: string, user: string) {
        // check if user of the community
        // check channel access
        return true;
    }
}