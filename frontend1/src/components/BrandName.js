import React from 'react';
import { Center } from '@chakra-ui/react';

export default function BrandName() {
    return (
        <Center mx={2} visibility={{ base: "hidden", md: "visible", lg: "visible" }}>
            <div className='brand-name'>
                <div>Developed </div> 
                <div> 
                    <span>by 
                    <a href={`https://moctrasoft.com`} style={{ marginLeft: "5px", backgroundColor: "green", color: "#ffffff", padding: 2, borderRadius: 2 }} target='_blank'>MỘC TRÀ SOFT</a></span>
                </div>
            </div>
        </Center>
    )
}