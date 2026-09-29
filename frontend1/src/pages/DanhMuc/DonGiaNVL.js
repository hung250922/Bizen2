import React, { useState, useRef, useEffect, useMemo } from 'react';
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

function DonGiaNVL() {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const initialRef = useRef(null);
    const toast = useToast();
    const navigate = useNavigate();
    const { search } = useLocation();
    const [limit, setLimit] = useState(25);
    const [searchText, setSearchText] = useState("");
    const [donGiaNVLs, setDonGiaNVLs] = useState([]);
    const mouted = useRef();

    const query = new URLSearchParams(search);

    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        if(!mouted.current) {
            mouted.current = true;
            fetchDonGiaNVLs();
        }
    }, []);

    const fetchDonGiaNVLs = async () => {
        const res = await httpClient.get(`/catering/don_gia_nguyen_vat_lieus`, { params: {} });
        console.log("--- get Đơn giá NVL res:", res);
        setDonGiaNVLs(res.data.data);
    };

    const onSubmit = async(values, form) => {
        confirmChoice("Bạn có đồng ý lưu không?", async() => {
            const res = await httpClient.post(`/catering/add_don_gia_nguyen_vat_lieu`, {
                ...values
            });

            console.log("--- add Đơn giá NVL res:", res);
            if(res.data.data) {
                toast({
                    description: "Cập nhật đơn giá NVL thành công!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-right"
                });
                fetchDonGiaNVLs();
                form.reset();
            }
        });
    }

    const filteredDonGiaNVLs = useMemo(() => {
        const keyword = searchText.trim().toLowerCase();

        if(!keyword) {
            return donGiaNVLs;
        }

        return donGiaNVLs.filter((item) =>
            `${item?.nvl_name || ''} ${item?.nvl_unit || ''}`
                .toLowerCase()
                .includes(keyword)
        );
    }, [donGiaNVLs, searchText]);

    const pageCount = Math.ceil(filteredDonGiaNVLs.length / limit);

    const paginatedDonGiaNVLs = useMemo(() => {
        const start = currentPage * limit;
        return filteredDonGiaNVLs.slice(start, start + limit);
    }, [filteredDonGiaNVLs, currentPage, limit]);

    useEffect(() => {
        setCurrentPage(0);
    }, [searchText]);

    useEffect(() => {
        if(pageCount > 0 && currentPage >= pageCount) {
            setCurrentPage(pageCount - 1);
        }
    }, [pageCount, currentPage]);

    return (
        <main className="min-h-screen w-full bg-[#f5f7f8] p-3 text-[#33474f] sm:p-5">
            <div className="w-full">


                <div className="grid w-full grid-cols-1 items-start gap-5 xl:grid-cols-[350px_minmax(0,1fr)]">

                    <section className="overflow-hidden rounded-2xl border border-[#e1e8ea] bg-white shadow-[0_2px_8px_rgba(0,0,0,.035)]">

                        <div className="border-b border-[#edf1f2] px-5 py-4">
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#72a9ad]">
                                COST MANAGEMENT
                            </p>

                            <h2 className="mt-1 text-[17px] font-bold text-[#354850]">
                                Thêm đơn giá NVL
                            </h2>

                            <p className="mt-1 text-[11px] text-[#86949a]">
                                Giá được dùng trực tiếp để tính BOM.
                            </p>
                        </div>

                        <Form
                            onSubmit={onSubmit}
                            render={({ handleSubmit, form, submitting, pristine, valid, values }) => {
                                return (
                                    <form onSubmit={handleSubmit} className="p-5">
                                        <div className="space-y-4">

                                            <Field name={`nvl_name`}>
                                                {({ input, meta }) => (
                                                    <FormControl>
                                                        <FormLabel
                                                            htmlFor={`nvl_name`}
                                                            mb={1.5}
                                                            fontSize="11px"
                                                            fontWeight="700"
                                                            color="#586a70"
                                                        >
                                                            Nguyên vật liệu
                                                        </FormLabel>

                                                        <Input
                                                            {...input}
                                                            id="nvl_name"
                                                            type="text"
                                                            placeholder="Ví dụ: Thịt heo"
                                                            h="42px"
                                                            px={3}
                                                            border="1px solid #d9e2e4"
                                                            borderRadius="9px"
                                                            fontSize="12px"
                                                            color="#41535a"
                                                            bg="white"
                                                            _hover={{
                                                                borderColor: "#a9cdd1"
                                                            }}
                                                            _focus={{
                                                                borderColor: "#65b4bd",
                                                                boxShadow: "0 0 0 1px #65b4bd"
                                                            }}
                                                        />
                                                    </FormControl>
                                                )}
                                            </Field>

                                            <Field name={`nvl_price`}>
                                                {({ input, meta }) => (
                                                    <FormControl>
                                                        <FormLabel
                                                            htmlFor={`nvl_price`}
                                                            mb={1.5}
                                                            fontSize="11px"
                                                            fontWeight="700"
                                                            color="#586a70"
                                                        >
                                                            Đơn giá NVL
                                                        </FormLabel>

                                                        <Input
                                                            {...input}
                                                            id="nvl_price"
                                                            type="number"
                                                            min={0}
                                                            placeholder="0"
                                                            h="42px"
                                                            px={3}
                                                            border="1px solid #d9e2e4"
                                                            borderRadius="9px"
                                                            fontSize="12px"
                                                            color="#41535a"
                                                            bg="white"
                                                            _hover={{
                                                                borderColor: "#a9cdd1"
                                                            }}
                                                            _focus={{
                                                                borderColor: "#65b4bd",
                                                                boxShadow: "0 0 0 1px #65b4bd"
                                                            }}
                                                        />
                                                    </FormControl>
                                                )}
                                            </Field>

                                            <div className="rounded-xl border border-[#dfeaec] bg-[#f3f9f9] px-4 py-3.5">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="text-[11px] font-bold text-[#56686f]">
                                                            Đơn vị nhỏ nhất
                                                        </p>
                                                        <p className="mt-0.5 text-[10px] text-[#89979c]">
                                                            Đơn giá áp dụng theo đơn vị nhỏ nhất.
                                                        </p>
                                                    </div>

                                                    <span className="rounded-md bg-white px-2 py-1 text-[9px] font-bold text-[#5a9ca4] shadow-sm">
                                                        NVL
                                                    </span>
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                w="100%"
                                                h="43px"
                                                mt={1}
                                                borderRadius="9px"
                                                bg="#69aaa6"
                                                color="white"
                                                fontSize="12px"
                                                fontWeight="700"
                                                leftIcon={
                                                    <Icon
                                                        as={MdSave}
                                                        boxSize={4}
                                                    />
                                                }
                                                loadingText="Đang cập nhật"
                                                _hover={{
                                                    bg: "#579963"
                                                }}
                                                _active={{
                                                    bg: "#69aaa6",
                                                }}
                                            >
                                                Lưu
                                            </Button>

                                        </div>
                                    </form>
                                )
                            }}
                        />
                    </section>

                    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e1e8ea] bg-white shadow-[0_2px_8px_rgba(0,0,0,.035)]">

                        <div className="flex flex-col gap-4 border-b border-[#edf1f2] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">

                            <div className="min-w-0">
                                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#72a9ad]">
                                    DANH MỤC NVL
                                </p>

                                <div className="mt-1 flex flex-wrap items-center gap-2.5">
                                    <h2 className="text-[17px] font-bold text-[#354850]">
                                        Danh sách đơn giá NVL
                                    </h2>

                                    <span className="rounded-md bg-[#edf7f8] px-2 py-1 text-[10px] font-extrabold text-[#4b9ba3]">
                                        {filteredDonGiaNVLs.length} nguyên vật liệu
                                    </span>
                                </div>

                                <p className="mt-1 text-[11px] text-[#86949a]">
                                    Danh sách đơn giá được tải từ hệ thống.
                                </p>
                            </div>

                            <div className="w-full lg:w-[250px]">
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <Icon
                                            as={MdSearch}
                                            boxSize={4}
                                            color="#8b999e"
                                        />
                                    </InputLeftElement>

                                    <Input
                                        aria-label="Tìm nguyên vật liệu"
                                        value={searchText}
                                        onChange={(event) => setSearchText(event.target.value)}
                                        placeholder="Tìm nguyên vật liệu..."
                                        h="39px"
                                        pl="36px"
                                        borderColor="#d9e2e4"
                                        borderRadius="9px"
                                        fontSize="11px"
                                        bg="#fbfcfc"
                                        _hover={{
                                            borderColor: "#abcdd1"
                                        }}
                                        _focus={{
                                            borderColor: "#65b4bd",
                                            boxShadow: "0 0 0 1px #65b4bd",
                                            bg: "white"
                                        }}
                                    />
                                </InputGroup>
                            </div>
                        </div>

                        <div className="w-full overflow-x-auto">
                            <TableContainer
                                w="100%"
                                maxH="calc(100vh - 285px)"
                                overflowY="auto"
                            >
                                <Table
                                    variant="simple"
                                    size="sm"
                                    layout="fixed"
                                    minW="720px"
                                    w="100%"
                                >
                                    <Thead
                                        position="sticky"
                                        top={0}
                                        zIndex={2}
                                        bg="#edf6f7"
                                    >
                                        <Tr>
                                            <Th
                                                w="60px"
                                                px={3}
                                                py={3.5}
                                                fontSize="9px"
                                                color="#587078"
                                                borderColor="#dfeaec"
                                            >
                                                STT
                                            </Th>

                                            <Th
                                                w="auto"
                                                px={3}
                                                py={3.5}
                                                fontSize="9px"
                                                color="#587078"
                                                borderColor="#dfeaec"
                                            >
                                                NGUYÊN VẬT LIỆU
                                            </Th>

                                            <Th
                                                w="210px"
                                                px={3}
                                                py={3.5}
                                                fontSize="9px"
                                                color="#587078"
                                                borderColor="#dfeaec"
                                            >
                                                ĐƠN GIÁ NVL
                                            </Th>

                                            <Th
                                                w="90px"
                                                px={2}
                                                py={3.5}
                                                fontSize="9px"
                                                color="#587078"
                                                borderColor="#dfeaec"
                                            >
                                                CẬP NHẬT
                                            </Th>
                                        </Tr>
                                    </Thead>

                                    <Tbody>
                                        {paginatedDonGiaNVLs.map((item, idx) => {
                                            const {
                                                _id,
                                                nvl_name,
                                                nvl_price,
                                                createdAt
                                            } = item;

                                            return (
                                                <Tr
                                                    key={_id}
                                                    bg={idx % 2 === 0 ? "white" : "#fbfcfc"}
                                                    _hover={{
                                                        bg: "#f2f8f8"
                                                    }}
                                                    transition="background .15s ease"
                                                >
                                                    <Td
                                                        px={3}
                                                        py={3.5}
                                                        fontSize="10px"
                                                        color="#829096"
                                                        borderColor="#edf1f2"
                                                    >
                                                        {currentPage * limit + idx + 1}
                                                    </Td>

                                                    <Td
                                                        px={3}
                                                        py={3.5}
                                                        borderColor="#edf1f2"
                                                    >
                                                        <Text
                                                            fontSize="11px"
                                                            fontWeight="700"
                                                            color="#40545b"
                                                            wordBreak="break-word"
                                                        >
                                                            {nvl_name || "—"}
                                                        </Text>
                                                    </Td>

                                                    <Td
                                                        px={3}
                                                        py={3.5}
                                                        borderColor="#edf1f2"
                                                    >
                                                        <span className="inline-flex rounded-md bg-[#f1f6f6] px-2 py-1 text-[11px] font-bold text-[#4e656c]">
                                                            {nvl_price !== undefined && nvl_price !== null
                                                                ? `${nvl_price} VND`
                                                                : "—"}
                                                        </span>
                                                    </Td>

                                                    <Td
                                                        px={2}
                                                        py={3.5}
                                                        borderColor="#edf1f2"
                                                    >
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center gap-1 rounded-md bg-[#edf7f8] px-2.5 py-1.5 text-[10px] font-bold text-[#4b9ba3] transition hover:bg-[#dceff0]"
                                                        >
                                                            <span aria-hidden="true">✎</span>
                                                            Sửa
                                                        </button>
                                                    </Td>
                                                </Tr>
                                            );
                                        })}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </div>

                        {!paginatedDonGiaNVLs.length && (
                            <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">
                                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef7f8] text-[#5aa5ae]">
                                    <Icon as={MdSettings} boxSize={5} />
                                </div>

                                <p className="text-sm font-bold text-[#596b72]">
                                    Không có nguyên vật liệu
                                </p>

                                <p className="mt-1 text-xs text-[#8a989d]">
                                    Không tìm thấy nguyên vật liệu phù hợp.
                                </p>
                            </div>
                        )}

                        <Flex
                            align="center"
                            justify="space-between"
                            flexWrap="wrap"
                            gap={3}
                            px={5}
                            py={3.5}
                            borderTop="1px solid #edf1f2"
                            bg="#fbfcfc"
                        >
                            <Text
                                fontSize="11px"
                                color="#7d8b91"
                            >
                                {filteredDonGiaNVLs.length === 0
                                    ? "Không có dữ liệu"
                                    : `Hiển thị ${currentPage * limit + 1}-${Math.min(
                                        (currentPage + 1) * limit,
                                        filteredDonGiaNVLs.length
                                    )} / ${filteredDonGiaNVLs.length} nguyên vật liệu`
                                }
                            </Text>

                            <ReactPaginate
                                previousLabel="‹"
                                nextLabel="›"
                                breakLabel="..."
                                pageCount={Math.max(pageCount, 1)}
                                forcePage={currentPage}
                                onPageChange={(selectedItem) => {
                                    setCurrentPage(selectedItem.selected);
                                }}
                                containerClassName="flex items-center gap-1"
                                pageClassName="inline-flex"
                                pageLinkClassName="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-[#dce5e7] bg-white px-2 text-[10px] font-semibold text-[#66777d] transition hover:bg-[#eef7f8]"
                                previousClassName="inline-flex"
                                previousLinkClassName="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-[#dce5e7] bg-white px-2 text-[14px] font-semibold text-[#66777d] transition hover:bg-[#eef7f8]"
                                nextClassName="inline-flex"
                                nextLinkClassName="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-[#dce5e7] bg-white px-2 text-[14px] font-semibold text-[#66777d] transition hover:bg-[#eef7f8]"
                                activeClassName="inline-flex"
                                activeLinkClassName="!border-[#65b4bd] !bg-[#65b4bd] !text-white"
                                disabledClassName="opacity-40"
                                disabledLinkClassName="!cursor-not-allowed"
                                breakLinkClassName="inline-flex h-7 min-w-7 items-center justify-center px-1 text-[10px] text-[#89969b]"
                            />
                        </Flex>

                    </section>
                </div>
            </div>
        </main>
    )
}

export default DonGiaNVL;