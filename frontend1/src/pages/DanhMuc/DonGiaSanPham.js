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

function DonGiaSanPham() {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const initialRef = useRef(null);
    const toast = useToast();
    const navigate = useNavigate();
    const { search } = useLocation();
    const [limit, setLimit] = useState(25);
    const [searchText, setSearchText] = useState("");
    const [donGiaSanPhams, setDonGiaSanPhams] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const query = new URLSearchParams(search);
    const mouted = useRef();

    useEffect(() => {
        if(!mouted.current) {
            mouted.current = true;
            fetchDonGiaSanPhams();
        }
    }, []);

    const fetchDonGiaSanPhams = async () => {
        const res = await httpClient.get(`/catering/don_gia_san_phams`, { params: {} });
        console.log("--- get Đơn giá sản phẩm res:", res);
        setDonGiaSanPhams(res.data.data);
    };

    const onSubmit = async(values, form) => {
        confirmChoice("Bạn có đồng ý lưu không?", async() => {
            const res = await httpClient.post(`/catering/add_don_gia_san_pham`, {
                ...values
            });

            console.log("--- add Đơn giá sản phẩm res:", res);
            if(res.data.data) {
                toast({
                    description: "Cập nhật đơn giá sản phẩm thành công!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-right"
                });
                fetchDonGiaSanPhams();
                form.reset();
            }
        });
    }

    const filteredDonGiaSanPhams = useMemo(() => {
        const keyword = searchText.trim().toLowerCase();

        if(!keyword) {
            return donGiaSanPhams;
        }

        return donGiaSanPhams.filter((item) =>
            `${item?.client_name || ''} ${item?.product_name || ''} ${item?.product_price || ''}`
                .toLowerCase()
                .includes(keyword)
        );
    }, [donGiaSanPhams, searchText]);

    const pageCount = Math.ceil(filteredDonGiaSanPhams.length / limit);

    const paginatedDonGiaSanPhams = useMemo(() => {
        const start = currentPage * limit;
        return filteredDonGiaSanPhams.slice(start, start + limit);
    }, [filteredDonGiaSanPhams, currentPage, limit]);

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
            <div className="mb-5">
                
            </div>

            <div className="grid w-full grid-cols-1 items-start gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">

                <section className="w-full overflow-hidden rounded-[16px] border border-[#e7edef] bg-white shadow-[0_8px_30px_rgba(50,80,90,0.05)]">
                    <div className="border-b border-[#eef2f3] px-5 py-[18px]">
                        <h2 className="text-[15px] font-semibold text-[#30434a]">
                            Thêm/Sửa Đơn giá sản phẩm
                        </h2>
                    </div>

                    <Form
                        onSubmit={onSubmit}
                        render={({ handleSubmit, form, submitting, pristine, valid, values }) => (
                            <form onSubmit={handleSubmit} className="px-5 py-5">
                                <div className="space-y-4">

                                    <Field name="client_name">
                                        {({ input, meta }) => (
                                            <FormControl>
                                                <FormLabel mb={1.5} fontSize="11px" fontWeight="600" color="#5f7076">
                                                    Khách hàng
                                                </FormLabel>
                                                <Input
                                                    {...input}
                                                    h="40px"
                                                    borderColor="#dfe7e9"
                                                    borderRadius="10px"
                                                    fontSize="12px"
                                                    bg="#fcfdfd"
                                                    transition="all .2s"
                                                    _hover={{ borderColor:"#c7dadd", bg:"white" }}
                                                    _focus={{ borderColor:"#74b6bd", boxShadow:"0 0 0 3px rgba(116,182,189,.12)", bg:"white" }}
                                                />
                                            </FormControl>
                                        )}
                                    </Field>

                                    <Field name="product_name">
                                        {({ input, meta }) => (
                                            <FormControl>
                                                <FormLabel mb={1.5} fontSize="11px" fontWeight="600" color="#5f7076">
                                                    Sản phẩm
                                                </FormLabel>
                                                <Input
                                                    {...input}
                                                    h="40px"
                                                    borderColor="#dfe7e9"
                                                    borderRadius="10px"
                                                    fontSize="12px"
                                                    bg="#fcfdfd"
                                                    transition="all .2s"
                                                    _hover={{ borderColor:"#c7dadd", bg:"white" }}
                                                    _focus={{ borderColor:"#74b6bd", boxShadow:"0 0 0 3px rgba(116,182,189,.12)", bg:"white" }}
                                                />
                                            </FormControl>
                                        )}
                                    </Field>

                                    <Field name="product_price">
                                        {({ input, meta }) => (
                                            <FormControl>
                                                <FormLabel mb={1.5} fontSize="11px" fontWeight="600" color="#5f7076">
                                                    Đơn giá
                                                </FormLabel>
                                                <Input
                                                    {...input}
                                                    type="number"
                                                    min={0}
                                                    h="40px"
                                                    borderColor="#dfe7e9"
                                                    borderRadius="10px"
                                                    fontSize="12px"
                                                    bg="#fcfdfd"
                                                    transition="all .2s"
                                                    _hover={{ borderColor:"#c7dadd", bg:"white" }}
                                                    _focus={{ borderColor:"#74b6bd", boxShadow:"0 0 0 3px rgba(116,182,189,.12)", bg:"white" }}
                                                />
                                            </FormControl>
                                        )}
                                    </Field>

                                    <Button
                                        type="submit"
                                        w="100%"
                                        h="40px"
                                        mt={2}
                                        borderRadius="10px"
                                        bg="#6eaaa6"
                                        color="white"
                                        fontSize="12px"
                                        fontWeight="700"
                                        boxShadow="0 4px 10px rgba(110,170,166,.15)"
                                        transition="all .2s"
                                        _hover={{ bg:"#629c98", transform:"translateY(-1px)", boxShadow:"0 6px 14px rgba(110,170,166,.2)" }}
                                        _active={{ transform:"translateY(0)" }}
                                    >
                                        <Icon as={MdSave} mr={2} boxSize={4} /> Lưu
                                    </Button>
                                </div>
                            </form>
                        )}
                    />
                </section>

                <section className="min-w-0 overflow-hidden rounded-[16px] border border-[#e7edef] bg-white shadow-[0_8px_30px_rgba(50,80,90,0.05)]">
                    <div className="flex flex-col gap-4 border-b border-[#eef2f3] px-5 py-[18px] lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-[15px] font-semibold text-[#30434a]">
                                Danh sách Đơn giá Sản Phẩm
                            </h2>
                            <p className="mt-1 text-[11px] text-[#8a989d]">
                                {filteredDonGiaSanPhams.length} sản phẩm
                            </p>
                        </div>

                        <InputGroup w={{ base:"100%", lg:"250px" }}>
                            <InputLeftElement pointerEvents="none">
                                <Icon as={MdSearch} boxSize={4} color="#8b999e" />
                            </InputLeftElement>
                            <Input
                                value={searchText}
                                onChange={(event) => {
                                    setSearchText(event.target.value);
                                    setCurrentPage(0);
                                }}
                                placeholder="Tìm khách hàng..."
                                aria-label="Tìm đơn giá sản phẩm"
                                h="39px"
                                pl="36px"
                                borderColor="#dfe7e9"
                                borderRadius="10px"
                                fontSize="11px"
                                bg="#fcfdfd"
                                transition="all .2s"
                                _hover={{ borderColor:"#c7dadd", bg:"white" }}
                                _focus={{ borderColor:"#74b6bd", boxShadow:"0 0 0 3px rgba(116,182,189,.12)", bg:"white" }}
                            />
                        </InputGroup>
                    </div>

                    <TableContainer maxH="calc(100vh - 260px)" overflowY="auto" overflowX="auto">
                        <Table variant="simple" size="sm" layout="fixed" minW="700px">
                            <Thead position="sticky" top={0} zIndex={2} bg="#f4f8f8">
                                <Tr>
                                    <Th w="60px" py="12px" fontSize="9px" fontWeight="700" color="#62757b" borderColor="#edf2f3">STT</Th>
                                    <Th w="30%" py="12px" fontSize="9px" fontWeight="700" color="#62757b" borderColor="#edf2f3">KHÁCH HÀNG</Th>
                                    <Th w="35%" py="12px" fontSize="9px" fontWeight="700" color="#62757b" borderColor="#edf2f3">SẢN PHẨM</Th>
                                    <Th w="25%" py="12px" fontSize="9px" fontWeight="700" color="#62757b" borderColor="#edf2f3">ĐƠN GIÁ SP</Th>
                                </Tr>
                            </Thead>

                            <Tbody>
                                {paginatedDonGiaSanPhams.map((item, idx) => {
                                    const { _id, client_name, product_name, product_price, createdAt } = item;
                                    return (
                                        <Tr key={_id || `${client_name}-${product_name}-${idx}`} _hover={{ bg:"#f8fbfb" }} transition="background .18s ease">
                                            <Td py="13px" fontSize="10px" color="#87959a" borderColor="#edf2f3">
                                                {currentPage * limit + idx + 1}
                                            </Td>
                                            <Td py="13px" fontSize="11px" fontWeight="600" color="#40545b" borderColor="#edf2f3">
                                                {client_name || "—"}
                                            </Td>
                                            <Td py="13px" fontSize="11px" color="#52666d" borderColor="#edf2f3">
                                                {product_name || "—"}
                                            </Td>
                                            <Td py="13px" borderColor="#edf2f3">
                                                <span className="inline-flex rounded-[7px] bg-[#f3f7f7] px-2.5 py-1 text-[11px] font-semibold text-[#4d646b]">
                                                    {product_price ?? "—"}
                                                </span>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>

                    {!paginatedDonGiaSanPhams.length && (
                        <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef7f8] text-[#5aa5ae]">
                                <Icon as={MdSettings} boxSize={5} />
                            </div>
                            <p className="text-sm font-semibold text-[#596b72]">Không có đơn giá sản phẩm</p>
                            <p className="mt-1 text-xs text-[#8a989d]">Không tìm thấy dữ liệu phù hợp.</p>
                        </div>
                    )}

                    <Flex align="center" justify="space-between" flexWrap="wrap" gap={3} px={5} py={3.5} borderTop="1px solid #eef2f3" bg="#fcfdfd">
                        <Text fontSize="11px" color="#7d8b91">
                            {filteredDonGiaSanPhams.length
                                ? `Hiển thị ${currentPage * limit + 1}-${Math.min((currentPage + 1) * limit, filteredDonGiaSanPhams.length)} / ${filteredDonGiaSanPhams.length}`
                                : "Không có dữ liệu"}
                        </Text>

                        <ReactPaginate
                            previousLabel="‹"
                            nextLabel="›"
                            breakLabel="..."
                            pageCount={Math.max(pageCount, 1)}
                            forcePage={currentPage}
                            onPageChange={(item) => setCurrentPage(item.selected)}
                            containerClassName="flex items-center gap-1"
                            pageClassName="inline-flex"
                            pageLinkClassName="inline-flex h-8 min-w-8 items-center justify-center rounded-[8px] border border-[#e0e8ea] bg-white px-2 text-[10px] font-semibold text-[#66777d] transition hover:bg-[#f3f8f8]"
                            previousClassName="inline-flex"
                            previousLinkClassName="inline-flex h-8 min-w-8 items-center justify-center rounded-[8px] border border-[#e0e8ea] bg-white px-2 text-[14px] text-[#66777d]"
                            nextClassName="inline-flex"
                            nextLinkClassName="inline-flex h-8 min-w-8 items-center justify-center rounded-[8px] border border-[#e0e8ea] bg-white px-2 text-[14px] text-[#66777d]"
                            activeClassName="inline-flex"
                            activeLinkClassName="!border-[#6eaaa6] !bg-[#6eaaa6] !text-white"
                            disabledClassName="opacity-40"
                            disabledLinkClassName="!cursor-not-allowed"
                        />
                    </Flex>
                </section>
            </div>
        </div>
    </main>
)
}

export default DonGiaSanPham;