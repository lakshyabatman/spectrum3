

export interface Pointer {
    collectionId: string,
    id: string
}

export class Community {
    id: string
    admin: string
    name: string
    description: string
    image: string
    channels: Pointer[]
    nftContract: string

    constructor(id: string, name: string, admin: string, description: string, image: string, channels: Pointer[],nftContract) {
        this.id = id
        this.admin = admin
        this.name = name
        this.description =description
        this.image = image
        this.channels = channels
        this.nftContract = nftContract
    }

    static fromDomain(json: any) {
        return new Community(
            json["id"],
            json["name"],
            json["admin"],
            json["description"],
            json["image"],
            json["channels"],
            json["nftContract"]
        )
    }
}

export class Channel {
    id: string
    communityId: string
    type: string
    name: string
    image: string
    filter: UserFilter

    constructor(
        id: string,
        communityId: string,
        type: string,
        name: string,
        image: string,
        filter: UserFilter
      ) {
        this.id = id
        this.communityId = communityId
        this.type = type
        this.name = name
        this.image = image
        this.filter = filter
      }
    
      static fromJSON(json: any): Channel {
        return new Channel(
          json['id'],
          json['communityId'],
          json['type'],
          json['name'],
          json['image'],
          UserFilter.fromJSON(json['userFilter'])
        )
      }
}

export class UserFilter {
    id: string
    all: boolean
    nftHolder: boolean
    nftSmartContract: string
    rankingFilter: boolean
    rankingLevels: string[]
  
    constructor(
        id: string,
        all: boolean,
        nftHolder: boolean,
        nftSmartContract: string,
        rankingFilter: boolean,
        rankingLevels: string[]
    ) {
        this.id = id;
        this.all = all
        this.nftHolder = nftHolder
        this.nftSmartContract = nftSmartContract
        this.rankingFilter = rankingFilter
        this.rankingLevels = rankingLevels
    }
  
    static fromJSON(json: any): UserFilter {
      return new UserFilter(
        json["id"],
        json['all'],
        json['nftHolder'],
        json['nftSmartContract'],
        json['rankingFilter'],
        json['rankingLevels']
      )
    }
  }


  export class Message {
    id: string
    channelId: string
    content: string
    communityUserId: string
    parent: Boolean
    parentId?: Boolean
  
    constructor(
      id: string,
      channelId: string,
      content: string,
      communityUserId: string,
      parent: boolean,
      parentId?: boolean
    ) {
      this.id = id
      this.channelId = channelId
      this.content = content
      this.communityUserId = communityUserId
      this.parent = parent
      this.parentId = parentId
    }
  }
  
  export class CommunityUser {
    id: string
    communityId: string
    token:string
    name:string
    description:string
    image:string
    address:string

    constructor(
        id: string,
        communityId: string,
        token: string,
        name: string,
        description: string,
        image: string,
        address: string
      ) {
        this.id = id
        this.communityId = communityId
        this.token = token
        this.name = name
        this.description = description
        this.image = image
        this.address = address
      }

      static fromJSON(json: any): CommunityUser {
        return new CommunityUser(
            json["id"],
            json["communityId"],
            json["token"],
            json["name"],
            json["description"],
            json["image"],
            json["address"]
        )
      }
  }

