import React, { useState, useRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { 
    Flex, Box, Heading, FormControl, FormLabel, Button, Input, InputGroup, InputRightElement, Icon, useToast
} from '@chakra-ui/react';
import { Form, Field } from 'react-final-form';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { sleep } from "../../../utils/helpers";
import { userStore } from "../../../zustand";

function CompanyInformations() {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const toast = useToast();
    const [ isProcessing, setIsProcessing ] = useState(false);
    const [ showOldPassword, setShowOldPassword ] = useState(false);
    const [ showNewPassword, setShowNewPassword ] = useState(false);
    const [ showConfirmNewPassword, setShowConfirmNewPassword ] = useState(false);

    const handleOldPasswordVisibility = () => setShowOldPassword(!showOldPassword);
    const handleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
    const handleConfirmNewPasswordVisibility = () => setShowConfirmNewPassword(!showConfirmNewPassword);

    const update_password = userStore((state) => state.update_password);

    const validate = (values) => {
        const errors = {};

        if(!values.currentPassword) {
            errors.currentPassword = "Required";
        }
        if(!values.newPassword) {
            errors.newPassword = "Required";
        }
        if(!values.confirmNewPassword) {
            errors.confirmNewPassword = "Required";
        }

        if(values.newPassword && values.confirmNewPassword && (values.newPassword !== values.confirmNewPassword)) {
            errors.differentNewPassword = "Required";
        }

        return errors;
    }

    const onSubmit = async(values) => {
        setIsProcessing(true);
        await sleep(500);
        const res = await update_password(values);
        if(res.data?.error) {
            toast({
                description: res.data?.error,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-right"
            })
        } else {
            toast({
                description: `Bạn đã cập nhật thành công!`,
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "bottom-right"
            })
        }

        setIsProcessing(false);
    }

    return (
        <Form
            onSubmit={onSubmit}
            initialValues={{
                id: cookies.loginCookie.id
            }}
            //keepDirtyOnReinitialize={true}
            validate={validate}
            render={({ handleSubmit, form, submitting, pristine, valid, values }) => {
                return (
                    <form onSubmit={handleSubmit}>
                        <Flex justify="center" w={{ base: "100%", md: "100vw", lg: "100vw" }}>
                            <Flex flexDirection="column" w="500px" boxShadow="lg" p={4} borderRadius={8}>
                                <Heading size="md" mb={4}>Thay đổi mật khẩu</Heading>

                               <Field name="currentPassword">
                                    {({ input, meta }) => (
                                        <FormControl isRequired>
                                            <FormLabel>Mật khẩu hiện tại:</FormLabel>
                                            <InputGroup>
                                                <Input {...input} type={showOldPassword ? 'text' : 'password'} placeholder=''
                                                    onCopy={(e) => {e.preventDefault()}} onPaste={(e) => {e.preventDefault()}}
                                                />
    
                                                <InputRightElement width="3rem">
                                                    <Button h="1.5rem" size="sm" onClick={handleOldPasswordVisibility}>
                                                        {showOldPassword ? <ViewOffIcon /> : <Icon as={ViewIcon} />}
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                        </FormControl>
                                    )}
                                </Field>

                                <Field name="newPassword">
                                    {({ input, meta }) => (
                                        <FormControl isRequired>
                                            <FormLabel>Mật khẩu mới:</FormLabel>
                                            <InputGroup>
                                                <Input {...input} type={showNewPassword ? 'text' : 'password'} placeholder=''
                                                    onCopy={(e) => {e.preventDefault()}} onPaste={(e) => {e.preventDefault()}}
                                                />

                                                <InputRightElement width="3rem">
                                                    <Button h="1.5rem" size="sm" onClick={handleNewPasswordVisibility}>
                                                        {showNewPassword ? <ViewOffIcon /> : <Icon as={ViewIcon} />}
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                        </FormControl>
                                    )}
                                </Field>

                                <Field name="confirmNewPassword">
                                    {({ input, meta }) => (
                                        <FormControl isRequired>
                                            <FormLabel>Xác nhận mật khẩu mới:</FormLabel>
                                            <InputGroup>
                                                <Input {...input} type={showConfirmNewPassword ? 'text' : 'password'} 
                                                    placeholder='' onCopy={(e) => {e.preventDefault()}} onPaste={(e) => {e.preventDefault()}}/>

                                                <InputRightElement width="3rem">
                                                    <Button h="1.5rem" size="sm" onClick={handleConfirmNewPasswordVisibility}>
                                                        {showConfirmNewPassword ? <ViewOffIcon /> : <Icon as={ViewIcon} />}
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                        </FormControl>
                                    )}
                                </Field>

                                <Button colorScheme='green' type='submit' size="lg" isDisabled={!valid || pristine} mt={4}
                                    isLoading={isProcessing}
                                    loadingText="Đang cập nhật"
                                >
                                    Cập nhật thông tin
                                </Button>
                            </Flex>
                        </Flex>
                    </form>
                )
            }}
        />
    )
}

export default CompanyInformations;