import React, { useState, useRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { 
    Flex, Heading, Input, Button, ButtonGroup, Text, CircularProgress, CircularProgressLabel,
    InputGroup, InputLeftElement, InputRightElement, Icon, IconButton, Select,
    Stack, HStack, Image, Wrap, WrapItem, Center, InputRightAddon,
    Tabs, Tab, TabList, TabPanels, TabPanel,
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, useDisclosure, useToast,
    VStack, FormControl, FormLabel
} from '@chakra-ui/react';
import ReactPaginate from 'react-paginate';
import { MdSettings, MdAdd, MdAddCircleOutline, MdCalendarToday, MdSearch, MdEdit, MdDeleteForever, MdSave } from 'react-icons/md';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { sleep, confirmChoice } from "../../utils/helpers"
import httpClient from '../../services/http-client';

function CauHinhTinhDiem() {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const initialRef = useRef(null);
    const toast = useToast();
    const navigate = useNavigate();
    const { search } = useLocation();
    const [limit, setLimit] = useState(25);
    const [searchText, setSearchText] = useState("");
    const [cauHinhTinhDiems, setCauHinhTinhDiems] = useState({});
    const mouted = useRef();

    const query = new URLSearchParams(search);
   
    useEffect(() => {
        if(!mouted.current) {
            mouted.current = true;
            fetchCauHinhTinhDiems();
        }
    }, []);

    const fetchCauHinhTinhDiems = async () => {
        const res = await httpClient.get(`/catering/cau_hinh_tinh_diems`);
        console.log("--- get cau hinh tinh diem res:", res);
        setCauHinhTinhDiems(res.data.data[0] || {});
    };

    const onSubmit = async(values, form) => {
        confirmChoice("Bạn có đồng ý lưu không?", async() => {
            const res = cauHinhTinhDiems._id ? 
                await httpClient.post(`/catering/edit_cau_hinh_tinh_diem`, {
                    ...values,
                    "id": cauHinhTinhDiems._id
                }) :
                await httpClient.post(`/catering/add_cau_hinh_tinh_diem`, {
                    ...values
                });

            console.log("--- add cau hinh tinh diem res:", res);
            if(res.data.data) {
                toast({
                    description: "Cập nhật cấu hình tính điểm thành công!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-right"
                });
                fetchCauHinhTinhDiems();
                form.reset();
            }
        });
    }


    return (
        <main className="min-h-full w-full min-w-0 overflow-x-hidden bg-[#f5f8f9] text-[#263238]">
            <div className="w-full p-2 md:p-3">

                <section className="overflow-hidden rounded-[16px] border border-[#dfe8ea] bg-white shadow-[0_7px_25px_rgba(35,78,83,.05)]">

                    <div className="border-b border-[#e8edef] px-4 py-4 md:px-5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                            <div className="flex min-w-0 items-center gap-3">
                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-[#eaf7f7] text-[#3e9898]">
                                    <Icon as={MdSettings} boxSize={5} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-[#79a6aa]">
                                        SYSTEM CONFIGURATION
                                    </p>


                                    <p className="mt-1 text-[10px] text-[#89979c]">
                                        Thiết lập trọng số các tiêu chí và quy tắc cảnh báo món ăn.
                                    </p>
                                </div>
                            </div>

                            <div className="w-fit rounded-full bg-[#eef8f7] px-3 py-1.5 text-[9px] font-extrabold text-[#3f8f8f]">
                                {cauHinhTinhDiems._id ? 'Đã có cấu hình' : 'Chưa có cấu hình'}
                            </div>
                        </div>
                    </div>

                    <Form
                        onSubmit={onSubmit}
                        initialValues={{
                            tc1_diem_trong_so: cauHinhTinhDiems.tc1_diem_trong_so || 0,
                            tc2_diem_trong_so: cauHinhTinhDiems.tc2_diem_trong_so || 0,
                            tc3_diem_trong_so: cauHinhTinhDiems.tc3_diem_trong_so || 0,
                            tc4_diem_trong_so: cauHinhTinhDiems.tc4_diem_trong_so || 0,
                            tc5_diem_trong_so: cauHinhTinhDiems.tc5_diem_trong_so || 0,
                            ngay_trung_phuong_phap_che_bien: cauHinhTinhDiems.ngay_trung_phuong_phap_che_bien || 0
                        }}
                        render={({ handleSubmit, form, submitting, pristine, valid, values }) => {
                            return (
                                <form onSubmit={handleSubmit} className="w-full">
                                    <div className="grid w-full grid-cols-1 gap-4 p-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,.8fr)] md:p-5">

                                        <section className="overflow-hidden rounded-[14px] border border-[#e1e8ea] bg-white">
                                            <div className="border-b border-[#e8edef] bg-[#fbfcfc] px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-[#4ba3a0]" />

                                                    <div>
                                                        <h2 className="text-[13px] font-extrabold text-[#3b5158]">
                                                            Trọng số tiêu chí
                                                        </h2>

                                                        <p className="mt-0.5 text-[9px] text-[#8b999e]">
                                                            Thiết lập điểm trọng số cho từng tiêu chí đánh giá.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">

                                                <Field name={`tc1_diem_trong_so`}>
                                                    {({ input, meta }) => (
                                                        <FormControl>
                                                            <div className="rounded-[12px] border border-[#e3eaec] bg-[#fbfcfc] p-3 transition hover:border-[#bfd9d9] hover:bg-white">
                                                                <div className="mb-2 flex items-start gap-2.5">
                                                                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] bg-[#eaf3ff] text-[10px] font-extrabold text-[#4f83c5]">
                                                                        TC1
                                                                    </span>

                                                                    <div className="min-w-0 flex-1">
                                                                        <FormLabel
                                                                            htmlFor={`tc1_diem_trong_so`}
                                                                            mb={0}
                                                                            className="!text-[10px] !font-bold !text-[#52666d]"
                                                                        >
                                                                            Tính theo độ gần nhất
                                                                        </FormLabel>

                                                                        <p className="mt-0.5 text-[8px] text-[#929fa3]">
                                                                            Điểm trọng số
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <Input
                                                                    {...input}
                                                                    id={`tc1_diem_trong_so`}
                                                                    type='number'
                                                                    min={0}
                                                                    h="40px"
                                                                    borderColor="#d7e2e4"
                                                                    borderRadius="9px"
                                                                    bg="white"
                                                                    fontSize="11px"
                                                                    fontWeight="700"
                                                                    color="#30464d"
                                                                    _hover={{ borderColor: "#bfd9d9" }}
                                                                    _focus={{
                                                                        borderColor:"#4aa2a0",
                                                                        boxShadow:"0 0 0 3px rgba(74,162,160,.10)"
                                                                    }}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                    )}
                                                </Field>

                                                <Field name={`tc2_diem_trong_so`}>
                                                    {({ input, meta }) => (
                                                        <FormControl>
                                                            <div className="rounded-[12px] border border-[#e3eaec] bg-[#fbfcfc] p-3 transition hover:border-[#bfd9d9] hover:bg-white">
                                                                <div className="mb-2 flex items-start gap-2.5">
                                                                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] bg-[#edf8ee] text-[10px] font-extrabold text-[#4d9956]">
                                                                        TC2
                                                                    </span>

                                                                    <div className="min-w-0 flex-1">
                                                                        <FormLabel
                                                                            htmlFor={`tc2_diem_trong_so`}
                                                                            mb={0}
                                                                            className="!text-[10px] !font-bold !text-[#52666d]"
                                                                        >
                                                                            Độ đa dạng protein
                                                                        </FormLabel>

                                                                        <p className="mt-0.5 text-[8px] text-[#929fa3]">
                                                                            Điểm trọng số
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <Input
                                                                    {...input}
                                                                    id={`tc2_diem_trong_so`}
                                                                    type='number'
                                                                    min={0}
                                                                    h="40px"
                                                                    borderColor="#d7e2e4"
                                                                    borderRadius="9px"
                                                                    bg="white"
                                                                    fontSize="11px"
                                                                    fontWeight="700"
                                                                    color="#30464d"
                                                                    _hover={{ borderColor: "#bfd9d9" }}
                                                                    _focus={{
                                                                        borderColor:"#4aa2a0",
                                                                        boxShadow:"0 0 0 3px rgba(74,162,160,.10)"
                                                                    }}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                    )}
                                                </Field>

                                                <Field name={`tc3_diem_trong_so`}>
                                                    {({ input, meta }) => (
                                                        <FormControl>
                                                            <div className="rounded-[12px] border border-[#e3eaec] bg-[#fbfcfc] p-3 transition hover:border-[#bfd9d9] hover:bg-white">
                                                                <div className="mb-2 flex items-start gap-2.5">
                                                                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] bg-[#fff5e9] text-[10px] font-extrabold text-[#d18d39]">
                                                                        TC3
                                                                    </span>

                                                                    <div className="min-w-0 flex-1">
                                                                        <FormLabel
                                                                            htmlFor={`tc3_diem_trong_so`}
                                                                            mb={0}
                                                                            className="!text-[10px] !font-bold !text-[#52666d]"
                                                                        >
                                                                            Phương pháp chế biến
                                                                        </FormLabel>

                                                                        <p className="mt-0.5 text-[8px] text-[#929fa3]">
                                                                            Điểm trọng số
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <Input
                                                                    {...input}
                                                                    id={`tc3_diem_trong_so`}
                                                                    type='number'
                                                                    min={0}
                                                                    h="40px"
                                                                    borderColor="#d7e2e4"
                                                                    borderRadius="9px"
                                                                    bg="white"
                                                                    fontSize="11px"
                                                                    fontWeight="700"
                                                                    color="#30464d"
                                                                    _hover={{ borderColor: "#bfd9d9" }}
                                                                    _focus={{
                                                                        borderColor:"#4aa2a0",
                                                                        boxShadow:"0 0 0 3px rgba(74,162,160,.10)"
                                                                    }}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                    )}
                                                </Field>

                                                <Field name={`tc4_diem_trong_so`}>
                                                    {({ input, meta }) => (
                                                        <FormControl>
                                                            <div className="rounded-[12px] border border-[#e3eaec] bg-[#fbfcfc] p-3 transition hover:border-[#bfd9d9] hover:bg-white">
                                                                <div className="mb-2 flex items-start gap-2.5">
                                                                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] bg-[#f3edff] text-[10px] font-extrabold text-[#805dd0]">
                                                                        TC4
                                                                    </span>

                                                                    <div className="min-w-0 flex-1">
                                                                        <FormLabel
                                                                            htmlFor={`tc4_diem_trong_so`}
                                                                            mb={0}
                                                                            className="!text-[10px] !font-bold !text-[#52666d]"
                                                                        >
                                                                            Mức độ yêu thích
                                                                        </FormLabel>

                                                                        <p className="mt-0.5 text-[8px] text-[#929fa3]">
                                                                            Điểm trọng số
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <Input
                                                                    {...input}
                                                                    id={`tc4_diem_trong_so`}
                                                                    type='number'
                                                                    min={0}
                                                                    h="40px"
                                                                    borderColor="#d7e2e4"
                                                                    borderRadius="9px"
                                                                    bg="white"
                                                                    fontSize="11px"
                                                                    fontWeight="700"
                                                                    color="#30464d"
                                                                    _hover={{ borderColor: "#bfd9d9" }}
                                                                    _focus={{
                                                                        borderColor:"#4aa2a0",
                                                                        boxShadow:"0 0 0 3px rgba(74,162,160,.10)"
                                                                    }}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                    )}
                                                </Field>

                                                <Field name={`tc5_diem_trong_so`}>
                                                    {({ input, meta }) => (
                                                        <FormControl>
                                                            <div className="rounded-[12px] border border-[#e3eaec] bg-[#fbfcfc] p-3 transition hover:border-[#bfd9d9] hover:bg-white">
                                                                <div className="mb-2 flex items-start gap-2.5">
                                                                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] bg-[#eef7f8] text-[10px] font-extrabold text-[#3f9898]">
                                                                        TC5
                                                                    </span>

                                                                    <div className="min-w-0 flex-1">
                                                                        <FormLabel
                                                                            htmlFor={`tc5_diem_trong_so`}
                                                                            mb={0}
                                                                            className="!text-[10px] !font-bold !text-[#52666d]"
                                                                        >
                                                                            Tính theo mùa vụ
                                                                        </FormLabel>

                                                                        <p className="mt-0.5 text-[8px] text-[#929fa3]">
                                                                            Điểm trọng số
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <Input
                                                                    {...input}
                                                                    id={`tc5_diem_trong_so`}
                                                                    type='number'
                                                                    min={0}
                                                                    h="40px"
                                                                    borderColor="#d7e2e4"
                                                                    borderRadius="9px"
                                                                    bg="white"
                                                                    fontSize="11px"
                                                                    fontWeight="700"
                                                                    color="#30464d"
                                                                    _hover={{ borderColor: "#bfd9d9" }}
                                                                    _focus={{
                                                                        borderColor:"#4aa2a0",
                                                                        boxShadow:"0 0 0 3px rgba(74,162,160,.10)"
                                                                    }}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                    )}
                                                </Field>

                                            </div>
                                        </section>

                                        <section className="overflow-hidden rounded-[14px] border border-[#e1e8ea] bg-white">
                                            <div className="border-b border-[#e8edef] bg-[#fbfcfc] px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-[#d98c62]" />

                                                    <div>
                                                        <h2 className="text-[13px] font-extrabold text-[#3b5158]">
                                                            Cảnh báo hệ thống
                                                        </h2>

                                                        <p className="mt-0.5 text-[9px] text-[#8b999e]">
                                                            Quy định số ngày không trùng phương pháp chế biến.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <Field name={`ngay_trung_phuong_phap_che_bien`}>
                                                    {({ input, meta }) => (
                                                        <FormControl>
                                                            <div className="rounded-[13px] border border-[#e5eaec] bg-[#fbfcfc] p-4">
                                                                <div className="mb-3 flex items-start gap-3">
                                                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-[#fff3e9] text-[#d8895b]">
                                                                        <Icon as={MdCalendarToday} boxSize={5} />
                                                                    </div>

                                                                    <div>
                                                                        <FormLabel
                                                                            htmlFor={`ngay_trung_phuong_phap_che_bien`}
                                                                            mb={0}
                                                                            className="!text-[11px] !font-extrabold !text-[#4d6269]"
                                                                        >
                                                                            Không trùng phương pháp chế biến
                                                                        </FormLabel>

                                                                        <p className="mt-1 text-[9px] leading-4 text-[#8d999d]">
                                                                            Số ngày áp dụng cho quy tắc cảnh báo.
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <Input
                                                                        {...input}
                                                                        id={`ngay_trung_phuong_phap_che_bien`}
                                                                        type='number'
                                                                        min={0}
                                                                        h="42px"
                                                                        borderColor="#d7e2e4"
                                                                        borderRadius="9px"
                                                                        bg="white"
                                                                        fontSize="12px"
                                                                        fontWeight="800"
                                                                        color="#30464d"
                                                                        _hover={{ borderColor: "#bfd9d9" }}
                                                                        _focus={{
                                                                            borderColor:"#4aa2a0",
                                                                            boxShadow:"0 0 0 3px rgba(74,162,160,.10)"
                                                                        }}
                                                                    />

                                                                    <span className="rounded-[8px] bg-[#eef7f6] px-3 py-2 text-[9px] font-bold text-[#498f8c]">
                                                                        ngày
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </FormControl>
                                                    )}
                                                </Field>

                                                <div className="mt-4 rounded-[11px] border border-[#e7edef] bg-[#f7fafb] px-3.5 py-3">
                                                    <div className="flex items-start gap-2">
                                                        <Icon
                                                            as={MdSettings}
                                                            boxSize={4}
                                                            className="mt-0.5 shrink-0 text-[#72a6a9]"
                                                        />

                                                        <div>
                                                            <p className="text-[10px] font-bold text-[#556a71]">
                                                                Cấu hình hiện tại
                                                            </p>

                                                            <p className="mt-1 text-[9px] leading-4 text-[#8b999e]">
                                                                Các giá trị được lấy trực tiếp từ cấu hình đang lưu trong hệ thống.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                    </div>

                                    <div className="flex flex-col gap-3 border-t border-[#e8edef] bg-[#fbfcfc] px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-5">
                                        <div>
                                            <p className="text-[10px] font-bold text-[#556a71]">
                                                Lưu cấu hình tính điểm
                                            </p>

                                            <p className="mt-0.5 text-[9px] text-[#929ea2]">
                                                Cập nhật sẽ được lưu vào hệ thống sau khi xác nhận.
                                            </p>
                                        </div>

                                        <Button
                                            colorScheme='green'
                                            type='submit'
                                            h="42px"
                                            px={6}
                                            borderRadius="10px"
                                            bg="#3f9898"
                                            color="white"
                                            fontSize="10px"
                                            fontWeight="800"
                                            leftIcon={<Icon as={MdSave} boxSize={4} />}
                                            isLoading={submitting}
                                            loadingText="Đang cập nhật"
                                            _hover={{
                                                bg:"#327f80",
                                                transform:"translateY(-1px)"
                                            }}
                                            _active={{
                                                transform:"translateY(0)"
                                            }}
                                            transition="all .18s ease"
                                        >
                                            Lưu cấu hình
                                        </Button>
                                    </div>
                                </form>
                            )
                        }}
                    />
                </section>
            </div>
        </main>
    )
}

export default CauHinhTinhDiem;