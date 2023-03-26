import { UserFilter } from "./models"

export interface CreateCommunityRequest {
    name: string,
    description: string,
    admin: string,
    image: string,
    nftContract: string

}

export interface CreateChannelRequest {
    name: string,
    type: string,
    image: string,
    filter: UserFilter,
}