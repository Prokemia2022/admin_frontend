import {Flex} from '@chakra-ui/react';
import Script from 'next/script';

export default function Fetching_Data_Loading_Animation({width,height,color}){
    return(
        <Flex>
            <Script  src="https://cdn.lordicon.com/bhenfmcm.js"></Script>
            <lord-icon 
                src="https://cdn.lordicon.com/vlupvdhl.json" 
                trigger="loop" 
                colors={`primary:${color},secondary:#ffffff`} 
                stroke="40" 
                style={{width:width,height:height,}} 
            >
            </lord-icon>
        </Flex>
    )
}

        