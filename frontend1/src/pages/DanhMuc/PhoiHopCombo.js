import React, { useState, useRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { 
    Flex, Heading, Input, Button, ButtonGroup, Text, CircularProgress, CircularProgressLabel,
    InputGroup, InputLeftElement, InputRightElement, Icon, IconButton, Select,
    Stack, HStack, Image, Wrap, WrapItem, Center, InputRightAddon,
    Tabs, Tab, TabList, TabPanels, TabPanel,
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, useDisclosure, useToast,
    VStack, FormControl, FormLabel, 
} from '@chakra-ui/react';
import ReactPaginate from 'react-paginate';
import { MdSettings, MdAdd, MdAddCircleOutline, MdCalendarToday, MdSearch, MdEdit, MdDeleteForever, MdSave } from 'react-icons/md';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { sleep, confirmChoice } from "../../utils/helpers";
import httpClient from '../../services/http-client';

function PhoiHopCombo() {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const initialRef = useRef(null);
    const toast = useToast();
    const navigate = useNavigate();
    const { search } = useLocation();
    const [limit, setLimit] = useState(25);
    const [searchText, setSearchText] = useState("");
    const [phoiHopCombos, setPhoiHopCombos] = useState([]);
    const mouted = useRef();

    const query = new URLSearchParams(search);
   
    useEffect(() => {
        if(!mouted.current) {
            mouted.current = true;
            fetchPhoiHopCombos();
        }
    }, []);

    const fetchPhoiHopCombos = async () => {
        const res = await httpClient.get(`/catering/phoi_hop_combos`, { params: {} });
        console.log("--- get Phối hợp combo res:", res);
        setPhoiHopCombos(res.data.data);
    };

    const onSubmit = async(values, form) => {
        confirmChoice("Bạn có đồng ý lưu không?", async() => {
            const res = await httpClient.post(`/catering/add_phoi_hop_combo`, {
                ...values
            });

            console.log("--- add Phối hợp combo res:", res);
            if(res.data.data) {
                toast({
                    description: "Cập nhật phối hợp combo thành công!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-right"
                });
                fetchPhoiHopCombos();
                form.reset();
            }
        });
    }

    const filteredPhoiHopCombos = phoiHopCombos.filter(item => {
        const keyword = searchText.trim().toLowerCase();

        if(!keyword) {
            return true;
        }

        return [
            item?.nvl_name,
            item?.nvl_have_to_go_with,
            item?.nvl_not_to_go_with
        ].some(value =>
            String(value || "").toLowerCase().includes(keyword)
        );
    });

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
                                        MENU CONFIGURATION
                                    </p>

                                    

                                    <p className="mt-1 text-[10px] text-[#89979c]">
                                        Thiết lập nguyên vật liệu nên đi cùng và không nên đi cùng.
                                    </p>
                                </div>
                            </div>

                            <div className="w-fit rounded-full bg-[#eef8f7] px-3 py-1.5 text-[9px] font-extrabold text-[#3f8f8f]">
                                {phoiHopCombos.length} cấu hình
                            </div>
                        </div>
                    </div>

                    <div className="grid w-full grid-cols-1 gap-4 p-4 xl:grid-cols-[350px_minmax(0,1fr)] md:p-5">

                        {/* ================= FORM ================= */}
                        <section className="h-fit overflow-hidden rounded-[14px] border border-[#e1e8ea] bg-white">

                            <div className="border-b border-[#e8edef] bg-[#fbfcfc] px-4 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-[#4ba3a0]" />

                                    <div>
                                        <h2 className="text-[13px] font-extrabold text-[#3b5158]">
                                            Thêm phối hợp combo
                                        </h2>

                                        <p className="mt-0.5 text-[9px] text-[#8b999e]">
                                            Nhập quy tắc phối hợp nguyên vật liệu.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Form
                                onSubmit={onSubmit}
                                render={({ handleSubmit, form, submitting, pristine, valid, values }) => {
                                    return (
                                        <form onSubmit={handleSubmit}>
                                            <div className="space-y-3 p-4">

                                                <Field name={`nvl_name`}>
                                                    {({ input, meta }) => (
                                                        <FormControl>
                                                            <div className="rounded-[12px] border border-[#e3eaec] bg-[#fbfcfc] p-3">
                                                                <div className="mb-2.5 flex items-center gap-2.5">
                                                                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-[#eaf3ff] text-[#4d83c4]">
                                                                        <Icon as={MdAdd} boxSize={4} />
                                                                    </div>

                                                                    <div>
                                                                        <FormLabel
                                                                            htmlFor={`nvl_name`}
                                                                            mb={0}
                                                                            className="!text-[10px] !font-extrabold !text-[#52666d]"
                                                                        >
                                                                            Nguyên vật liệu
                                                                        </FormLabel>

                                                                        <p className="mt-0.5 text-[8px] text-[#919da1]">
                                                                            Nguyên vật liệu chính
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <Input
                                                                    {...input}
                                                                    id={`nvl_name`}
                                                                    type='text'
                                                                    h="40px"
                                                                    placeholder="Ví dụ: Thịt gà"
                                                                    borderColor="#d7e2e4"
                                                                    borderRadius="9px"
                                                                    bg="white"
                                                                    fontSize="11px"
                                                                    color="#30464d"
                                                                    _hover={{
                                                                        borderColor:"#bfd9d9"
                                                                    }}
                                                                    _focus={{
                                                                        borderColor:"#4aa2a0",
                                                                        boxShadow:"0 0 0 3px rgba(74,162,160,.10)"
                                                                    }}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                    )}
                                                </Field>

                                                <Field name={`nvl_have_to_go_with`}>
                                                    {({ input, meta }) => (
                                                        <FormControl>
                                                            <div className="rounded-[12px] border border-[#e3eaec] bg-[#fbfcfc] p-3">
                                                                <div className="mb-2.5 flex items-center gap-2.5">
                                                                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-[#edf8ee] text-[#4c9956]">
                                                                        <Icon as={MdAddCircleOutline} boxSize={4} />
                                                                    </div>

                                                                    <div>
                                                                        <FormLabel
                                                                            htmlFor={`nvl_have_to_go_with`}
                                                                            mb={0}
                                                                            className="!text-[10px] !font-extrabold !text-[#52666d]"
                                                                        >
                                                                            Nên đi cùng
                                                                        </FormLabel>

                                                                        <p className="mt-0.5 text-[8px] text-[#919da1]">
                                                                            Nguyên vật liệu nên kết hợp
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <Input
                                                                    {...input}
                                                                    id={`nvl_have_to_go_with`}
                                                                    type='text'
                                                                    h="40px"
                                                                    placeholder="Ví dụ: Rau cải"
                                                                    borderColor="#d7e2e4"
                                                                    borderRadius="9px"
                                                                    bg="white"
                                                                    fontSize="11px"
                                                                    color="#30464d"
                                                                    _hover={{
                                                                        borderColor:"#bfd9d9"
                                                                    }}
                                                                    _focus={{
                                                                        borderColor:"#4aa2a0",
                                                                        boxShadow:"0 0 0 3px rgba(74,162,160,.10)"
                                                                    }}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                    )}
                                                </Field>

                                                <Field name={`nvl_not_to_go_with`}>
                                                    {({ input, meta }) => (
                                                        <FormControl>
                                                            <div className="rounded-[12px] border border-[#e3eaec] bg-[#fbfcfc] p-3">
                                                                <div className="mb-2.5 flex items-center gap-2.5">
                                                                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-[#fff3ed] text-[#d88559]">
                                                                        <Icon as={MdDeleteForever} boxSize={4} />
                                                                    </div>

                                                                    <div>
                                                                        <FormLabel
                                                                            htmlFor={`nvl_not_to_go_with`}
                                                                            mb={0}
                                                                            className="!text-[10px] !font-extrabold !text-[#52666d]"
                                                                        >
                                                                            Không nên đi cùng
                                                                        </FormLabel>

                                                                        <p className="mt-0.5 text-[8px] text-[#919da1]">
                                                                            Nguyên vật liệu cần tránh kết hợp
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <Input
                                                                    {...input}
                                                                    id={`nvl_not_to_go_with`}
                                                                    type='text'
                                                                    h="40px"
                                                                    placeholder="Ví dụ: Sữa chua"
                                                                    borderColor="#d7e2e4"
                                                                    borderRadius="9px"
                                                                    bg="white"
                                                                    fontSize="11px"
                                                                    color="#30464d"
                                                                    _hover={{
                                                                        borderColor:"#bfd9d9"
                                                                    }}
                                                                    _focus={{
                                                                        borderColor:"#4aa2a0",
                                                                        boxShadow:"0 0 0 3px rgba(74,162,160,.10)"
                                                                    }}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                    )}
                                                </Field>

                                                <div className="rounded-[11px] border border-[#e7edef] bg-[#f7fafb] px-3.5 py-3">
                                                    <div className="flex items-start gap-2">
                                                        <Icon
                                                            as={MdSettings}
                                                            boxSize={4}
                                                            className="mt-0.5 shrink-0 text-[#72a6a9]"
                                                        />

                                                        <div>
                                                            <p className="text-[10px] font-bold text-[#556a71]">
                                                                Quy tắc phối hợp
                                                            </p>

                                                            <p className="mt-1 text-[9px] leading-4 text-[#8b999e]">
                                                                Một nguyên vật liệu có thể thiết lập danh sách đi cùng hoặc cần tránh.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Button
                                                    colorScheme='green'
                                                    type='submit'
                                                    w="100%"
                                                    h="42px"
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
                                                    Lưu phối hợp combo
                                                </Button>

                                            </div>
                                        </form>
                                    )
                                }}
                            />   
                        </section>

                        {/* ================= LIST ================= */}
                        <section className="min-w-0 overflow-hidden rounded-[14px] border border-[#e1e8ea] bg-white">

                            <div className="border-b border-[#e8edef] px-4 py-4 md:px-5">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-[#65a8ae]" />

                                            <h2 className="text-[14px] font-extrabold text-[#3b5158]">
                                                Danh sách phối hợp combo
                                            </h2>
                                        </div>

                                        <p className="mt-1 text-[9px] text-[#8b999e]">
                                            {filteredPhoiHopCombos.length} cấu hình được hiển thị
                                        </p>
                                    </div>

                                    <InputGroup
                                        w={{base:"100%", sm:"245px"}}
                                    >
                                        <InputLeftElement pointerEvents="none">
                                            <Icon
                                                as={MdSearch}
                                                boxSize={4}
                                                color="#92a0a4"
                                            />
                                        </InputLeftElement>

                                        <Input
                                            value={searchText}
                                            onChange={(event) => {
                                                setSearchText(event.target.value);
                                            }}
                                            placeholder="Tìm nguyên vật liệu..."
                                            h="38px"
                                            pl="35px"
                                            borderColor="#d7e2e4"
                                            borderRadius="9px"
                                            bg="#fbfcfc"
                                            fontSize="10px"
                                            _hover={{
                                                borderColor:"#bfd9d9"
                                            }}
                                            _focus={{
                                                borderColor:"#4aa2a0",
                                                boxShadow:"0 0 0 3px rgba(74,162,160,.10)"
                                            }}
                                        />
                                    </InputGroup>
                                </div>
                            </div>

                            <div className="w-full overflow-x-auto">
                                <TableContainer maxH="calc(100vh - 285px)" overflowY="auto">
                                    <Table
                                        variant="simple"
                                        size="sm"
                                        layout="fixed"
                                        minW="850px"
                                    >
                                        <Thead
                                            position="sticky"
                                            top={0}
                                            zIndex={2}
                                            bg="#f4f8f8"
                                        >
                                            <Tr>
                                                <Th
                                                    w="60px"
                                                    px={3}
                                                    py={3}
                                                    fontSize="9px"
                                                    color="#60747a"
                                                    borderColor="#e4ecee"
                                                >
                                                    STT
                                                </Th>

                                                <Th
                                                    w="190px"
                                                    px={3}
                                                    py={3}
                                                    fontSize="9px"
                                                    color="#60747a"
                                                    borderColor="#e4ecee"
                                                >
                                                    NGUYÊN VẬT LIỆU
                                                </Th>

                                                <Th
                                                    w="285px"
                                                    px={3}
                                                    py={3}
                                                    fontSize="9px"
                                                    color="#60747a"
                                                    borderColor="#e4ecee"
                                                >
                                                    NÊN ĐI CÙNG
                                                </Th>

                                                <Th
                                                    w="285px"
                                                    px={3}
                                                    py={3}
                                                    fontSize="9px"
                                                    color="#60747a"
                                                    borderColor="#e4ecee"
                                                >
                                                    KHÔNG NÊN ĐI CÙNG
                                                </Th>
                                            </Tr>
                                        </Thead>

                                        <Tbody>
                                            {filteredPhoiHopCombos.map((item, idx) => {
                                                const {
                                                    _id,
                                                    nvl_name,
                                                    nvl_have_to_go_with,
                                                    nvl_not_to_go_with
                                                } = item;

                                                return (
                                                    <Tr
                                                        key={_id}
                                                        className="transition-colors hover:bg-[#f8fbfb]"
                                                    >
                                                        <Td
                                                            px={3}
                                                            py={4}
                                                            fontSize="10px"
                                                            color="#8a989d"
                                                            borderColor="#edf2f3"
                                                        >
                                                            {idx + 1}
                                                        </Td>

                                                        <Td
                                                            px={3}
                                                            py={4}
                                                            borderColor="#edf2f3"
                                                            verticalAlign="top"
                                                        >
                                                            <div className="flex items-start gap-2">
                                                                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#4aa2a0]" />

                                                                <Text
                                                                    fontSize="11px"
                                                                    fontWeight="800"
                                                                    color="#3b5158"
                                                                    lineHeight="1.5"
                                                                    wordBreak="break-word"
                                                                >
                                                                    {nvl_name || "—"}
                                                                </Text>
                                                            </div>
                                                        </Td>

                                                        <Td
                                                            px={3}
                                                            py={4}
                                                            borderColor="#edf2f3"
                                                            verticalAlign="top"
                                                        >
                                                            {nvl_have_to_go_with ? (
                                                                <div className="rounded-[8px] bg-[#eff8ef] px-2.5 py-2">
                                                                    <div className="mb-1 flex items-center gap-1.5">
                                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#53a35d]" />

                                                                        <span className="text-[8px] font-extrabold uppercase tracking-wide text-[#619069]">
                                                                            Nên đi cùng
                                                                        </span>
                                                                    </div>

                                                                    <Text
                                                                        fontSize="10px"
                                                                        color="#536a59"
                                                                        lineHeight="1.45"
                                                                        wordBreak="break-word"
                                                                    >
                                                                        {nvl_have_to_go_with}
                                                                    </Text>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[10px] text-[#b0b9bc]">
                                                                    —
                                                                </span>
                                                            )}
                                                        </Td>

                                                        <Td
                                                            px={3}
                                                            py={4}
                                                            borderColor="#edf2f3"
                                                            verticalAlign="top"
                                                        >
                                                            {nvl_not_to_go_with ? (
                                                                <div className="rounded-[8px] bg-[#fff4ee] px-2.5 py-2">
                                                                    <div className="mb-1 flex items-center gap-1.5">
                                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#d98a5f]" />

                                                                        <span className="text-[8px] font-extrabold uppercase tracking-wide text-[#b97858]">
                                                                            Không nên đi cùng
                                                                        </span>
                                                                    </div>

                                                                    <Text
                                                                        fontSize="10px"
                                                                        color="#73594d"
                                                                        lineHeight="1.45"
                                                                        wordBreak="break-word"
                                                                    >
                                                                        {nvl_not_to_go_with}
                                                                    </Text>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[10px] text-[#b0b9bc]">
                                                                    —
                                                                </span>
                                                            )}
                                                        </Td>
                                                    </Tr>
                                                )
                                            })}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </div>

                            {filteredPhoiHopCombos.length === 0 && (
                                <div className="flex min-h-[260px] flex-col items-center justify-center px-5 text-center">
                                    <div className="grid h-12 w-12 place-items-center rounded-[12px] bg-[#eef7f8] text-[#62a5ab]">
                                        <Icon as={MdSettings} boxSize={5} />
                                    </div>

                                    <p className="mt-3 text-sm font-semibold text-[#596c72]">
                                        Không có dữ liệu
                                    </p>

                                    <p className="mt-1 text-[10px] text-[#8c999e]">
                                        Chưa có cấu hình phối hợp combo phù hợp.
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col gap-2 border-t border-[#edf2f3] bg-[#fbfcfc] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-[9px] text-[#839196]">
                                    Hiển thị {filteredPhoiHopCombos.length} / {phoiHopCombos.length} cấu hình
                                </span>

                                <span className="text-[9px] font-semibold text-[#8b999e]">
                                    Cấu hình phối hợp nguyên vật liệu
                                </span>
                            </div>
                        </section>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default PhoiHopCombo;