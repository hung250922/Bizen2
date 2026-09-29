import React, {useState, useEffect, useRef} from 'react';
import { 
    Flex, Box, Heading, FormControl, FormLabel, Input, Button, Text, CircularProgress,
    InputGroup, InputRightElement, Icon, Alert, AlertIcon, AlertDescription,
    useDisclosure, HStack, VStack, Image, Link, Center, useToast
} from '@chakra-ui/react';
import {
    ViewIcon, ViewOffIcon
} from '@chakra-ui/icons';
import { MdSettings } from 'react-icons/md';
import { FaGoogle, FaFacebook, FaStore } from 'react-icons/fa';
import { Form, Field } from 'react-final-form';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin, GoogleLogin, googleLogout } from "@react-oauth/google";
import FacebookLogin from '@greatsumini/react-facebook-login';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from "axios";
import { LOGIN_MAX_AGE, SELECTED_CLINIC_MAX_AGE, ERROR_CODES } from "../../constants";
// import ForgotPasswordModal from '../Home/Modals/ForgotPasswordModal';
import BrandName from '../../components/BrandName';
import { authStore } from "../../zustand";
import { sleep } from "../../utils/helpers";

function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isHuman, setIsHuman] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [googleResponse, setGoogleResponse] = useState(null);
    const [error, setError] = useState(null);
    const handlePasswordVisibility = () => setShowPassword(!showPassword);

    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie", "selectedClinic"]);
    const navigate = useNavigate();
  
    const toast = useToast();
    const captchaRef = useRef(null);
    const mounted = useRef();
    // const initialRef = useRef(null);
    // const forgotPasswordModal = useDisclosure();

    const authenticate = authStore((state) => state.authenticate);

    useEffect(() => {
        if(!mounted.current) {   
            if(cookies.loginCookie?.data) {
                navigate("/");
            }
            mounted.current = true;
        }
    });

    useEffect(
        () => {
            if(googleResponse) {
                axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleResponse.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${googleResponse.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then(async(res) => {
                    const { email, name, picture, verified_email } = res.data;
                    console.log("google profile", res.data);

                    let authenticateRes = await axios.post(`${process.env.REACT_APP_API_ENDPOINT_URL}/authenticate`, {email, name, picture, verified_email});
                    console.log("check user exist response", authenticateRes); 
                    if(!authenticateRes.data.data) {
                        const addUserRes = await axios.post(`${process.env.REACT_APP_API_ENDPOINT_URL}/user`, {
                            email, name, picture,
                            isAuthenticated: false
                        });
                        console.log("check user exist response", addUserRes); 
                        setError("Vui lòng liên hệ quản trị viên để kích hoạt tài khoản!");
                    } else if(authenticateRes.data.data && !authenticateRes.data.data.isAuthenticated) {
                        setError("Tài khoản của bạn đang chờ được kích hoạt, vui lòng liên hệ quản trị viên!");
                    } else {
                        setCookie("loginCookie", { token: authenticateRes.data.accessToken, data: authenticateRes.data.data }, { path: '/', maxAge: LOGIN_MAX_AGE });
                        toast({
                            description: `Đăng nhập thành công!`,
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                            position: "bottom-right"
                        });
                        await sleep(1000);
                        navigate("/");
                    }

                    // if(response.data && response.data.accessToken) {
                    //     console.log("response", response);
                    //     // setCookie("loginCookie", { token: response.data.accessToken, data: response.data.data }, { path: '/', maxAge: 5*(24*60*60) });
                    //     // navigate("/");
                    // } else {
                    //     setError("Đăng nhập bằng Google không thành công!");
                    // }
                })
                .catch((err) => {
                    //console.log("get profile error", err)
                    setError("Đăng nhập bằng Google không thành công!");
                })
            }
        },
        [googleResponse]
    );


    const handleChangeCaptcha = async(value) => {
        try
        {
            let response = await axios.post(`${process.env.REACT_APP_WEB_SERVER_URL}/authenticateReCaptcha`, {token: value}, {
                auth: {
                    username: process.env.REACT_APP_BASIC_AUTH_USERNAME,
                    password: process.env.REACT_APP_BASIC_AUTH_PASSWORD
                }
            })
            if(response.data && response.data.action === "Human") {
                setIsHuman(true);
            } else {
                setIsHuman(false);
            }
        }
        catch(error) {
            if(error?.code) {
                toast({
                    id: "global-error-info",
                    description: `${ERROR_CODES[error?.code]} (${error?.code})`,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-right"
                });
            }
        }
    }

    const validate = (values) => {
        const errors = {};

        if(!values.phone) {
            errors.phone = "Required";
        }
        if(!values.password) {
            errors.password = "Required";
        }
        
        return errors;
    }

    const onSubmit = async(values) => {
        //setIsLoading(true);
        if(values.phone === "11111111" & values.password === "Abc@123") {
            // const res = await authenticate(values);

            // if(res.data?.error) {
            //     setIsLoading(false);
            //     toast({
            //         title: `Lỗi`,
            //         description: res.data?.error,
            //         status: "warning",
            //         duration: 3000,
            //         isClosable: true,
            //         position: "bottom-right"
            //     })
            // } else {
            setCookie("loginCookie", {phone: "11111111"}, { path: '/', maxAge: LOGIN_MAX_AGE });
            toast({
                description: `Đăng nhập thành công!`,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom-right"
            });
            await sleep(1000);
            navigate("/");
            // }
        } else {
            toast({
                title: `Lỗi`,
                description: `Số điện thoại hoặc mật khẩu không chính xác!`,
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "bottom-right"
            })
        }
    }

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => {
            console.log(codeResponse);
            //             access_token
            // : 
            // "ya29.a0Aa7MYioG_bDcb1tEKAOmNoI2GjVx0qPB8CJIjYwiDZwABT8BFFe39GqvZIr8R_4aknJpri_1qfd0hMG8hUBXqEZb7NvIPshxQWmAjvLN6WqnI5FudxJs0zSOatysjoxezEHdZZ9Ofg56pR-KHljnxatvaFHoi1MgG0a28amh8PLFqJzsXLGhKTVk7uIOSPXEtvYUkHAaCgYKAeUSARYSFQHGX2MiJKcF6X0YwMyDIpJA93_uYA0206"
            // authuser
            // : 
            // "0"
            // expires_in
            // : 
            // 3599
            // iss
            // : 
            // "https://accounts.google.com"
            // prompt
            // : 
            // "consent"
            // scope
            // : 
            // "email profile https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile"
            // token_type
            // : 
            // "Bearer"

            setGoogleResponse(codeResponse);
        },
        onError: (error) => {
            console.log("Login Failed:", error);
            //setError("Đăng nhập bằng Google không thành công!");
        },
        
    });

    const handleGoogleLogout = () => {
        googleLogout();
    }

    return (
        <React.Fragment>
            <Form
                onSubmit={onSubmit}
                validate={validate}
                render={({ handleSubmit, form, submitting, pristine, valid, values }) => {
                    return (
                        <Flex flexDirection="column" width="full" height="100vh" bg="#F7F7F7">
                            <Flex flexDirection={{ base: "column", md: "row", lg: "row" }} width="100vw" align="space-between" alignItems="center" justify="flex-end" gap={8}>
                                <Box minW="400px" height="fit-content" alignItems="center" p={8} borderWidth={1} borderRadius={8}>
                                    <Box textAlign="center">
                                        <HStack display={{ base: "flex", md: "none", lg: "none" }} justify="center">
                                            <Icon as={FaStore} boxSize={6} color="green"/>
                                            <Text color="green" fontSize={24} fontWeight="bold">Chạm Kem Bơ</Text>
                                        </HStack>
                                        <Heading>ĐĂNG NHẬP</Heading>
                                        {
                                            error &&
                                            <Alert status="error" borderRadius={4}>
                                                <AlertIcon />
                                                <AlertDescription>{error}</AlertDescription>
                                            </Alert>
                                        }
                                    </Box>

                                    <Box my={4} textAlign="left">
                                        {/* <form onSubmit={handleSubmit}> */}
                                            {/* <Field name="phone">
                                                {({ input, meta }) => (
                                                    <FormControl mt={4} isRequired>
                                                        <FormLabel>Số điện thoại</FormLabel>
                                                        <Input {...input} type='tel'/>
                                                    </FormControl>
                                                )}
                                            </Field>

                                            <Field name="password">
                                                {({ input, meta }) => (
                                                    <FormControl mt={4} isRequired>
                                                        <FormLabel>Mật khẩu</FormLabel>
                                                        <InputGroup>
                                                            <Input 
                                                                {...input}
                                                                type={showPassword ? 'text' : 'password'}
                                                                size="lg"
                                                            />
                                    
                                                            <InputRightElement width="3rem">
                                                                <Button h="1.5rem" size="sm" onClick={handlePasswordVisibility}>
                                                                    {showPassword ? <ViewOffIcon /> : <Icon as={ViewIcon} />}
                                                                </Button>
                                                            </InputRightElement>
                                                        </InputGroup>
                                                    </FormControl>
                                                )}
                                            </Field> */}

                                            {/* <Center mt={2}>
                                                <ReCAPTCHA 
                                                    sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY}
                                                    onChange={handleChangeCaptcha}
                                                    ref={captchaRef}
                                                />
                                            </Center> */}

                                            <VStack alignItems="center">
                                                {/* <Button colorScheme='green' width="full" mt={2} type='submit' isDisabled={!valid}
                                                    isLoading={isLoading}
                                                    loadingText="Đang đăng nhập"
                                                >
                                        
                                                </Button> */}
                                                <Button colorScheme='blue' width="full" onClick={handleGoogleLogin}>
                                                    <Icon boxSize={4} as={FaGoogle} marginRight="8px"/> 
                                                    <Text fontSize="14px">Đăng nhập với Google</Text>
                                                </Button>
                                            </VStack>
                                        {/* </form> */}
                                    </Box>
                                </Box>

                                <Flex display={{ base: "none", md: "inherit" }} bg="teal.300" height="800px" width="50vw" justify="center" align="center" 
                                    borderBottomLeftRadius={16} backgroundImage="/images/green-gradient-0.jpg" backgroundPosition="53% 50%"
                                    gap={2}
                                >
                                    <Icon as={FaStore} boxSize={24} color="#ffffff"/>
                                    <Text color="#ffffff" fontSize={48} fontWeight="bold">Chạm Kem Bơ</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    )
                }}
            />

            {/* <BrandName /> */}
        </React.Fragment>
    )
}

export default LoginForm;