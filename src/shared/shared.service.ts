import { Injectable } from "@nestjs/common";
import { Polybase } from "@polybase/client";
import { ethPersonalSign } from '@polybase/eth'



@Injectable() 
export class SharedService {

    db(): Polybase {
        return new Polybase({
            defaultNamespace:
              'pk/0x7266c364232549b780de6b53db6ac9d22b41d678278b02637ecaa4270d754ace2384d81347c8b8215008b6bea6b5464becdbc742b6f20d58b5584c4ebae76ce2/Community',
              signer: (data) => {
                return {
                  h: 'eth-personal-sign',
                  sig: ethPersonalSign(process.env.PRIVATE_KEY, data)
                }
                }
          })
        //   TODO: in our app we need to add private key of the wallet 

        
    }

}