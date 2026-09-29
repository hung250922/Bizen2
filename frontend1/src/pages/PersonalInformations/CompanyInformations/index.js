import React, { useState, useRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { 
    Flex, Box, Heading, FormControl, FormLabel, Input, Button, useToast
} from '@chakra-ui/react';
import { Form, Field } from 'react-final-form';
import { sleep } from "../../../utils/helpers";
import { companyStore } from "../../../zustand";

function CompanyInformations() {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const [ isProcessing, setIsProcessing ] = useState(false);
    const toast = useToast();
    const get_company = companyStore((state) => state.get_company);
    const company_detail = companyStore((state) => state.company_detail);
    const update_company = companyStore((state) => state.update_company);

    useEffect(() => {
        get_company(cookies.loginCookie.id);
    }, []);

    const validate = (values) => {
        const errors = {};

        if(!values.name) {
            errors.name = "Required";
        }

        return errors;
    }

    const onSubmit = async(values) => {
        setIsProcessing(true);
        await sleep(500);
        const res = await update_company(values);
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
                ...company_detail
            }}
            //keepDirtyOnReinitialize={true}
            validate={validate}
            render={({ handleSubmit, form, submitting, pristine, valid, values }) => {
                return (
                    <form onSubmit={handleSubmit}>
                        <Flex justify="center" w={{ base: "100%", md: "100vw", lg: "100vw" }}>
                            <Flex flexDirection="column" w="500px" boxShadow="lg" p={4} borderRadius={8}>
                                <Heading size="md" mb={4}>Thông tin cửa hàng</Heading>

                                <Field name="name">
                                    {({ input, meta }) => (
                                        <FormControl isRequired>
                                            <FormLabel>Tên</FormLabel>
                                            <Input {...input} type='text' maxLength={25}/>
                                        </FormControl>
                                    )}
                                </Field>

                                <Field name="representation">
                                    {({ input, meta }) => (
                                        <FormControl>
                                            <FormLabel>Người đại diện</FormLabel>
                                            <Input {...input} type='text'/>
                                        </FormControl>
                                    )}
                                </Field>

                                <Field name="phone">
                                    {({ input, meta }) => (
                                        <FormControl>
                                            <FormLabel>Số Điện Thoại</FormLabel>
                                            <Input {...input} type="tel" />
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

                                <Field name="address">
                                    {({ input, meta }) => (
                                        <FormControl isRequired>
                                            <FormLabel>Địa chỉ</FormLabel>
                                            <Input {...input} type='text'/>
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