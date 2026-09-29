import React, {useState} from "react";
import { TiSocialFacebookCircular } from 'react-icons/ti'
import FacebookLogin from '@greatsumini/react-facebook-login';
import { Image } from '@chakra-ui/react';

function Home() {
    const [login, setLogin] = useState(false);
    const [data, setData] = useState({});
    const [picture, setPicture] = useState('');

    const responseFacebook = (response) => {
        console.log(response);
        setData(response);
        setPicture(response.picture.data.url);
        if(response.id) {
            setLogin(true);
        } else {
            setLogin(false);
        }
    }
    
    //550956477495838
    //Id: cu1142398627060946
    return (
        <div>
            Test Facebook Login
            <div style={{ width: "300px", height: "100px", backgroundColor: "rebeccapurple"}}>
                {
                    !login &&
                    <FacebookLogin 
                        appId="550956477495838"    //
                        onSuccess={(response) => {
                            console.log('--- Login Success!', response)
                        }}
                        //onSuccess={responseFacebook}
                        onFail={(error) => {
                            console.log('--- Login Failed', error)
                        }}
                        onProfileSuccess={responseFacebook}
                        // onProfileSuccess={(response) => {
                        //     console.log("Get Profile Success!", response)
                        // }}
                        style={{
                            backgroundColor: '#4267b2',
                            color: '#fff',
                            fontSize: '16px',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '4px',
                        }}
                    />
                }
                {
                    login && 
                    <Image src={picture} />
                }
            </div>
            <div style={{ width: "300px", height: "100px", backgroundColor: "yellowgreen"}}>
                {
                    login &&
                    <p>
                        Name: {data.name}
                        Email: {data.email}
                    </p>
                }
            </div>
        </div>
    )
}

export default Home;