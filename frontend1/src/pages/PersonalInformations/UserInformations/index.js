import React, { useState, useRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { 
    Flex, Box, Heading, FormControl, FormLabel, Input, Button, useToast
} from '@chakra-ui/react';
import { Form, Field } from 'react-final-form';
import { sleep } from "../../../utils/helpers";
import { userStore } from "../../../zustand";

function UserInformations() {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const toast = useToast();
    const [ isProcessing, setIsProcessing ] = useState(false);
    const get_user = userStore((state) => state.get_user);
    const user_detail = userStore((state) => state.user_detail);
    const update_user = userStore((state) => state.update_user);

    useEffect(() => {
        get_user(cookies.loginCookie.id);
    }, []);

    const validate = (values) => {
        const errors = {};

        if(!values.company_id) {
            errors.company_id = "Required";
        }
        if(!values.full_name) {
            errors.full_name = "Required";
        }
        if(!values.phone) {
            errors.phone = "Required";
        }

        return errors;
    }

    const onSubmit = async(values) => {
        setIsProcessing(true);
        await sleep(500);
        const res = await update_user(values);
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
                ...user_detail
            }}
            //keepDirtyOnReinitialize={true}
            validate={validate}
            render={({ handleSubmit, form, submitting, pristine, valid, values }) => {
                return (
                    <form onSubmit={handleSubmit}>
                        <Flex justify="center" w={{ base: "100%", md: "100vw", lg: "100vw" }}>
                            <Flex flexDirection="column" w="500px" boxShadow="lg" p={4} borderRadius={8}>
                                <Heading size="md" mb={4}>Thông tin tài khoản</Heading>

                                <Field name="full_name">
                                    {({ input, meta }) => (
                                        <FormControl isRequired>
                                            <FormLabel>Họ tên</FormLabel>
                                            <Input {...input} type='text' maxLength={25}/>
                                        </FormControl>
                                    )}
                                </Field>

                                <Field name="phone">
                                    {({ input, meta }) => (
                                        <FormControl isRequired>
                                            <FormLabel>Số Điện Thoại</FormLabel>
                                            <Input {...input} type="tel" isDisabled={true}/>
                                        </FormControl>
                                    )}
                                </Field>

                                <Field name="email">
                                    {({ input, meta }) => (
                                        <FormControl>
                                            <FormLabel>Email</FormLabel>
                                            <Input {...input} type="email" />
                                        </FormControl>
                                    )}
                                </Field>

                                <Button colorScheme='green' type='submit' size="lg" isDisabled={!valid} mt={4}
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

export default UserInformations;