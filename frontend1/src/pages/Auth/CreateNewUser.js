import React, {useState, useEffect, useRef} from 'react';
import { 
    Flex, Box, Heading, FormControl, FormLabel, Input, Button, Text, CircularProgress,
    InputGroup, InputRightElement, Icon, HStack, VStack, Image, Link, Center, useToast
} from '@chakra-ui/react';
import {
    ViewIcon, ViewOffIcon
} from '@chakra-ui/icons';
import { MdClose } from 'react-icons/md';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { Form, Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from "axios";
import moment from 'moment';
import validator from "validator";

import { FACEBOOK_OAUTH_APP_ID, ERROR_CODES } from "../../constants";
import _404Page from '../../components/404Page';
import DropZoneWithImage from '../../components/DropZoneWithImage';
import { displayConfirmAlert, catchAxiosError } from "../utils"

export default function CreateNewUserForm() {
    const [registerCompany, setRegisterCompany] = useState(null);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isHuman, setIsHuman] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isValidNewPassword, setIsValidNewPassword] = useState(true);
    const [isValidPhone, setIsValidPhone] = useState(true);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [portraitFile, setPortraitFile] = useState(null);
    const [notFoundResult, setNotFoundResult] = useState(false);

    const handlePasswordVisibility = () => setShowPassword(!showPassword);
    const handleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const navigate = useNavigate();
    const mounted = useRef();
    const captchaRef = useRef(null);
    const toast = useToast();

    const { register_code } = useParams();

    useEffect(() => {
        if(!mounted.current) {
            handleLoadCompanyWithRegisterCode();
            mounted.current = true;
        }
    });

    const handleLoadCompanyWithRegisterCode = async() => {
        if(register_code) {
            try
            {
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT_URL}/companies/register_code/${register_code}`, {
                    auth: {
                        username: process.env.REACT_APP_BASIC_AUTH_USERNAME,
                        password: process.env.REACT_APP_BASIC_AUTH_PASSWORD
                    }
                });

                if(res.data) {
                    // if(res.data.is_active === false) {
                    //     displayConfirmAlert(`"${res.data.name}" chưa được kích hoạt!`, () => navigate("/"));
                    // }

                    let momentRegisterCodeExpired = moment(res.data.register_code_expired);
                    let momentNewDate = moment(new Date());
                    let dif = momentRegisterCodeExpired.diff(momentNewDate, "minutes");
        
                    if(dif <= 0) {
                        displayConfirmAlert("Link này hiện tại đã hết hiệu lực!", () => navigate("/"));
                    } else {
                        setRegisterCompany(res.data);
                    }
                } else {    
                    setNotFoundResult(true);
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
        } else {
            setNotFoundResult(true);
        }
    }

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
        if(!values.full_name) {
            errors.full_name = "Required";
        }
        if(!values.email) {
            errors.email = "Required";
        }
        if(!values.password) {
            errors.password = "Required";
        }
        if(!values.confirm_password) {
            errors.confirm_password = "Required";
        }

        if(values.password && values.confirm_password && (values.password !== values.confirm_password)) {
            errors.difference_password = "Required";
        }
        
        if(values.password?.length > 0) {
            const isStrongPassword = validator.isStrongPassword(values.password, {minLength: 8, minLowercase: 1, minUppercase: 1, minSymbols: 0, minNumbers: 1})
            setIsValidNewPassword(isStrongPassword);
            if(!isStrongPassword) {
                errors.strongPassword = "Required";
            }
        } else {
            setIsValidNewPassword(true);
        }

        if(values.phone?.length > 0) {
            const isValidPhone = validator.isMobilePhone(values.phone, "vi-VN");
            setIsValidPhone(isValidPhone);
            if(!isValidPhone) {
                errors.validPhone = "Required";
            }
        }

        if(values.email?.length > 0) {
            const isValidEmail = validator.isEmail(values.email);
            setIsValidEmail(isValidEmail);
            if(!isValidEmail) {
                errors.validEmail = "Required";
            }
        }

        return errors;
    }

    const onSubmit = async(values) => {
        setIsProcessing(true);

        try
        {
            let portrait_url = null;

            if(portraitFile) {
                // upload portrait
                let portraitFiledata = new FormData();
                portraitFiledata.append('uri', portraitFile);

                let resUpload = await axios.post(`${process.env.REACT_APP_API_ENDPOINT_URL}/upload?subPath=users`, portraitFiledata, { 
                    headers: { "Content-Type": "multipart/form-data" } ,
                    auth: {
                        username: process.env.REACT_APP_BASIC_AUTH_USERNAME,
                        password: process.env.REACT_APP_BASIC_AUTH_PASSWORD
                    }
                });

                if(resUpload.data?.status === 200) {
                    portrait_url = resUpload.data.fileName;
                }
            }

            let res = await axios.post(`${process.env.REACT_APP_API_ENDPOINT_URL}/users`, {
                ...values,
                company_id: registerCompany?.id,
                portrait_url,
                roles: "admin"
            }, {
                auth: {
                    username: process.env.REACT_APP_BASIC_AUTH_USERNAME,
                    password: process.env.REACT_APP_BASIC_AUTH_PASSWORD
                }
            });

            if(res.data?.status === 200) {
                // update "register_code" = null to disable create user by link
                await axios.put(`${process.env.REACT_APP_API_ENDPOINT_URL}/companies/${registerCompany?.id}`, {
                    is_active: true,
                    register_code: null,
                }, {
                    auth: {
                        username: process.env.REACT_APP_BASIC_AUTH_USERNAME,
                        password: process.env.REACT_APP_BASIC_AUTH_PASSWORD
                    }
                });

                displayConfirmAlert("Bạn đã tạo tài khoản thành công", () => navigate("/login"));
            } else if(res.data?.status === 0) {
                displayConfirmAlert(res.data?.msg);
            }
        }
        catch(error) {
            if(error?.code) {
                toast({
                    description: `${ERROR_CODES[error?.code]} (${error?.code})`,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-right"
                });
            }
        }

        setIsProcessing(false);
    }

    if(notFoundResult) {
        return (
            <_404Page />
        )
    }

    return (
        <Form
            onSubmit={onSubmit}
            validate={validate}
            render={({ handleSubmit, form, submitting, pristine, valid, values }) => {
                return (
                    <Flex flexDirection="column" width="full" height="100vh" bg="#F7F7F7" backgroundImage="/images/clinic-bg.jpeg">
                        <Flex justifyContent="flex-start">
                            <Box mt={4} width={{base: "100vw", md: "60vw", lg: "40vw", xl: "40vw"}} alignItems="center" 
                                justifyContent="center" px={{ base: 4, md: 4, lg: 18, xl: 16 }}
                            >
                                <Box px={4} py={2} borderWidth={1} borderRadius={8} boxShadow="lg" bg="#FFFFFF">
                                    <Box textAlign="center">
                                        <Heading>Tạo tài khoản</Heading>
                                    </Box>

                                    <Flex direction="column" my={4} textAlign="left">
                                        <form onSubmit={handleSubmit}>
                                            <HStack align="flex-start">
                                                <VStack width="100%">
                                                    <Field name="phone">
                                                        {({ input, meta }) => (
                                                            <FormControl isRequired>
                                                                <FormLabel>Số Điện Thoại</FormLabel>
                                                                <Input {...input} type='tel' placeholder='Nhập số điện thoại' />
                                                                {
                                                                    !isValidPhone &&
                                                                    <FormLabel color="red">Nhập đúng Số Điện Thoại</FormLabel>
                                                                }
                                                            </FormControl>
                                                        )}
                                                    </Field>

                                                    <Field name="email">
                                                        {({ input, meta }) => (
                                                            <FormControl isRequired>
                                                                <FormLabel>Email</FormLabel>
                                                                <Input {...input} type='email' placeholder='Nhập Email'/>
                                                                {
                                                                    !isValidEmail &&
                                                                    <FormLabel color="red">Nhập đúng Email</FormLabel>
                                                                }
                                                            </FormControl>
                                                        )}
                                                    </Field>

                                                    <Field name="full_name">
                                                        {({ input, meta }) => (
                                                            <FormControl isRequired>
                                                                <FormLabel>Họ tên</FormLabel>
                                                                <Input {...input} type='text' placeholder='Nhập Họ tên' />
                                                            </FormControl>
                                                        )}
                                                    </Field>

                                                    <Field name="password">
                                                        {({ input, meta }) => (
                                                            <FormControl isRequired>
                                                                <FormLabel>Mật khẩu</FormLabel>
                                                                <InputGroup>
                                                                    <Input {...input} type={showPassword ? 'text' : 'password'} placeholder='Nhập mật khẩu' autoComplete="off" 
                                                                        onCopy={(e) => {e.preventDefault()}} onPaste={(e) => {e.preventDefault()}}
                                                                    />

                                                                    <InputRightElement width="3rem">
                                                                        <Button h="1.5rem" size="sm" onClick={handlePasswordVisibility}>
                                                                            {showPassword ? <ViewOffIcon /> : <Icon as={ViewIcon} />}
                                                                        </Button>
                                                                    </InputRightElement>
                                                                </InputGroup>
                                                                {
                                                                    !isValidNewPassword &&
                                                                    <FormLabel color="red">(Độ dài tối thiểu 8 ký tự bao gồm ít nhất 1 chữ in hoa, 1 chữ in thường và 1 ký tự số)</FormLabel>
                                                                }
                                                            </FormControl>
                                                        )}
                                                    </Field>
                                                    
                                                    <Field name="confirm_password">
                                                        {({ input, meta }) => (
                                                            <FormControl isRequired>
                                                                <FormLabel>Nhập lại mật khẩu</FormLabel>
                                                                <InputGroup>
                                                                    <Input {...input} type={showConfirmPassword ? 'text' : 'password'} placeholder='Nhập lại mật khẩu' 
                                                                        onCopy={(e) => {e.preventDefault()}} onPaste={(e) => {e.preventDefault()}}
                                                                    />

                                                                    <InputRightElement width="3rem">
                                                                            <Button h="1.5rem" size="sm" onClick={handleConfirmPasswordVisibility}>
                                                                                {showConfirmPassword ? <ViewOffIcon /> : <Icon as={ViewIcon} />}
                                                                            </Button>
                                                                        </InputRightElement>
                                                                </InputGroup>
                                                            </FormControl>
                                                        )}
                                                    </Field>

                                                    <FormControl mt={2}>
                                                        <FormLabel>Ảnh đại diện</FormLabel>
                                                        <DropZoneWithImage callback={setPortraitFile}/>
                                                    </FormControl>
                                                </VStack>
                                            </HStack>

                                            <Center mt={2}>
                                                <ReCAPTCHA 
                                                    sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY}
                                                    onChange={handleChangeCaptcha}
                                                    ref={captchaRef}
                                                />
                                            </Center>

                                            <VStack alignItems="center">
                                                <Button colorScheme='green' width="full" mt={2} type='submit' isDisabled={!valid || !isHuman}
                                                    isProcessing={isProcessing}
                                                    loadingText="Đang xử lý"
                                                >
                                                    Đăng ký
                                                </Button>
                                            </VStack>
                                        </form>

                                        <VStack alignItems="center" mt={2}>
                                            <Link color="teal.500" href='/' fontWeight="700">Trở về trang chủ</Link>
                                        </VStack>
                                    </Flex>
                                </Box>
                            </Box>

                            <Box width={{base: "0vw", md: "40vw", lg: "60vw", xl: "60vw"}}>
                                <Image alt="login_background" src="/images/login_background.png"/>
                            </Box>
                        </Flex>
                    </Flex>
                )
            }}
        />
    )
}