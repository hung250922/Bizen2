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

function BOMMonAn() {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const initialRef = useRef(null);
    const toast = useToast();
    const navigate = useNavigate();
    const { search } = useLocation();
    const [limit, setLimit] = useState(25);
    const [searchText, setSearchText] = useState("");
    const [bomMonAns, setBomMonAns] = useState([]);
    const mouted = useRef();

    const query = new URLSearchParams(search);

    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        if(!mouted.current) {
            mouted.current = true;
            fetchBomMonAns();
        }
    }, []);

    const fetchBomMonAns = async () => {
        const res = await httpClient.get(`/catering/bom_mon_ans`, { params: {} });
        console.log("--- get BOM mon an res:", res);
        setBomMonAns(res.data.data);
    };

    const onSubmit = async(values, form) => {
        confirmChoice("Bạn có đồng ý lưu không?", async() => {
            const res = await httpClient.post(`/catering/add_bom_mon_an`, {
                ...values,
                "is_encouraged": true
            });

            console.log("--- add BOM mon an res:", res);
            if(res.data.data) {
                toast({
                    description: "Thêm BOM món ăn thành công!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-right"
                });
                fetchBomMonAns();
                form.reset();
            }
        });
    }

    const filteredBomMonAns = useMemo(() => {
        const keyword = searchText.trim().toLowerCase();

        if (!keyword) {
            return bomMonAns;
        }

        return bomMonAns.filter((item) =>
            String(item?.food_name || "")
                .toLowerCase()
                .includes(keyword)
        );
    }, [bomMonAns, searchText]);

    const pageSize = 25;
    const pageCount = Math.ceil(filteredBomMonAns.length / pageSize);

    const paginatedBomMonAns = useMemo(() => {
        const start = currentPage * pageSize;
        return filteredBomMonAns.slice(start, start + pageSize);
    }, [filteredBomMonAns, currentPage]);

    useEffect(() => {
        setCurrentPage(0);
    }, [searchText]);

    useEffect(() => {
        if (currentPage > 0 && currentPage >= pageCount) {
            setCurrentPage(Math.max(pageCount - 1, 0));
        }
    }, [pageCount, currentPage]);

    return (
    <main className="min-h-[calc(100vh-116px)] w-full bg-[#f5f9f9] p-3 text-[#33474f] sm:p-5">
        <div className="w-full">
            <div className="grid w-full grid-cols-1 items-start gap-4 xl:grid-cols-[350px_minmax(0,1fr)]">
                <section className="overflow-hidden rounded-[16px] border border-[#e4eded] bg-white shadow-[0_6px_24px_rgba(43,86,89,.045)]">
                    <div className="border-b border-[#edf2f2] px-5 py-4">
                        <div className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#78aaa9]">COST MANAGEMENT</div>
                        <h2 className="mt-1 text-[16px] font-semibold text-[#31474e]">Thêm món ăn</h2>
                        <p className="mt-1 text-[11px] text-[#8b9a9e]">Chọn nguyên vật liệu từ danh mục đơn giá.</p>
                    </div>

                    <Form onSubmit={onSubmit} render={({handleSubmit, form, submitting, pristine, valid, values}) => (
                        <form onSubmit={handleSubmit} className="p-5">
                            <div className="space-y-3">
                                <Field name="food_name">
                                    {({input, meta}) => (
                                        <FormControl>
                                            <FormLabel mb={1.5} fontSize="10px" fontWeight="700" color="#53666d">Tên món ăn</FormLabel>
                                            <Input {...input} placeholder="Ví dụ: Gà chiên nước mắm" h="40px" borderColor="#dfe8e9" borderRadius="9px" fontSize="11px" bg="#fcfefe" _hover={{borderColor:"#c6dadd"}} _focus={{borderColor:"#67aaa7",boxShadow:"0 0 0 3px rgba(103,170,167,.1)"}} />
                                        </FormControl>
                                    )}
                                </Field>

                                <div className="rounded-[11px] border border-[#e2ebec] bg-[#f8fbfb] p-2.5">
                                    <div className="mb-2.5">
                                        <p className="text-[11px] font-bold text-[#53666d]">Nguyên vật liệu</p>
                                        <p className="mt-0.5 text-[9px] text-[#8b999d]">Nhập NVL, đơn vị tính và định mức.</p>
                                    </div>

                                    <div className="space-y-2">
                                        {[1,2,3,4,5,6,7].map((nvlIdx) => (
                                            <div key={nvlIdx} className="rounded-[10px] border border-[#e1e9ea] bg-white p-2.5">
                                                <span className="mb-2 inline-flex rounded-md bg-[#edf7f7] px-2 py-1 text-[9px] font-bold text-[#559a98]">NVL{nvlIdx}</span>
                                                <div className="grid grid-cols-[minmax(0,1fr)_65px_78px] gap-2">
                                                    <Field name={`NVL${nvlIdx}`}>
                                                        {({input, meta}) => (
                                                            <FormControl>
                                                                <FormLabel mb={1} fontSize="9px" fontWeight="600" color="#68797e">Nguyên vật liệu</FormLabel>
                                                                <Input {...input} placeholder="Tên NVL" h="35px" px={2.5} borderColor="#dce6e8" borderRadius="8px" fontSize="10px" _focus={{borderColor:"#67aaa7",boxShadow:"0 0 0 2px rgba(103,170,167,.1)"}} />
                                                            </FormControl>
                                                        )}
                                                    </Field>

                                                    <Field name={`NVL${nvlIdx}_DVT`}>
                                                        {({input, meta}) => (
                                                            <FormControl>
                                                                <FormLabel mb={1} fontSize="9px" fontWeight="600" color="#68797e">ĐVT</FormLabel>
                                                                <Input {...input} placeholder="g" h="35px" px={2} borderColor="#dce6e8" borderRadius="8px" fontSize="10px" _focus={{borderColor:"#67aaa7",boxShadow:"0 0 0 2px rgba(103,170,167,.1)"}} />
                                                            </FormControl>
                                                        )}
                                                    </Field>

                                                    <Field name={`NVL${nvlIdx}_DM`}>
                                                        {({input, meta}) => (
                                                            <FormControl>
                                                                <FormLabel mb={1} fontSize="9px" fontWeight="600" color="#68797e">Định mức</FormLabel>
                                                                <Input {...input} type="number" min={0} placeholder="0" h="35px" px={2} borderColor="#dce6e8" borderRadius="8px" fontSize="10px" _focus={{borderColor:"#67aaa7",boxShadow:"0 0 0 2px rgba(103,170,167,.1)"}} />
                                                            </FormControl>
                                                        )}
                                                    </Field>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                

                                <Button type="submit" w="100%" h="41px" mt={1} borderRadius="9px" bg="#69aaa6" color="white" fontSize="11px" fontWeight="700" leftIcon={<Icon as={MdSave} boxSize={4}/>} isLoading={submitting} loadingText="Đang lưu..." _hover={{bg:"#5e9c98",transform:"translateY(-1px)"}} _active={{transform:"translateY(0)"}} transition="all .18s ease">
                                    Lưu món ăn
                                </Button>
                            </div>
                        </form>
                    )}/>
                </section>

                <section className="min-w-0 overflow-hidden rounded-[16px] border border-[#e4eded] bg-white shadow-[0_6px_24px_rgba(43,86,89,.045)]">
                    <div className="flex flex-col gap-3 border-b border-[#edf2f2] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#78aaa9]">DANH MỤC MÓN ĂN</div>
                            <div className="mt-1 flex items-center gap-2">
                                <h2 className="text-[16px] font-semibold text-[#31474e]">Danh sách BOM món ăn</h2>
                                <span className="rounded-md bg-[#edf7f7] px-2 py-1 text-[9px] font-bold text-[#579b96]">{filteredBomMonAns.length} món</span>
                            </div>
                        </div>

                        <InputGroup w={{base:"100%",lg:"220px"}}>
                            <InputLeftElement pointerEvents="none">
                                <Icon as={MdSearch} boxSize={3.5} color="#8b999e"/>
                            </InputLeftElement>
                            <Input value={searchText} onChange={(event) => {setSearchText(event.target.value);setCurrentPage(0)}} placeholder="Tìm món ăn..." h="36px" pl="34px" borderColor="#dfe8e9" borderRadius="9px" fontSize="11px" bg="#fcfefe" _focus={{borderColor:"#67aaa7",boxShadow:"0 0 0 3px rgba(103,170,167,.1)"}} />
                        </InputGroup>
                    </div>

                    <TableContainer maxH="calc(100vh - 270px)" overflowY="auto" overflowX="auto">
                        <Table variant="simple" size="sm" layout="fixed" minW="1080px">
                            <Thead position="sticky" top={0} zIndex={2} bg="#eef6f5">
                                <Tr>
                                    <Th w="50px" px={3} py={3} fontSize="9px" color="#5d7379">STT</Th>
                                    <Th w="170px" px={3} py={3} fontSize="9px" color="#5d7379">MÓN ĂN</Th>
                                    {[1,2,3,4,5,6,7].map(nvlIdx => <Th key={nvlIdx} w="120px" px={3} py={3} fontSize="9px" color="#5d7379">NVL{nvlIdx}</Th>)}
                                    <Th w="65px" />
                                </Tr>
                            </Thead>

                            <Tbody>
                                {paginatedBomMonAns.map((item, idx) => (
                                    <Tr key={item._id} _hover={{bg:"#f8fbfb"}} transition="background .18s ease">
                                        <Td px={3} py={3} fontSize="10px" color="#849398" borderColor="#edf2f2">{currentPage * pageSize + idx + 1}</Td>
                                        <Td px={3} py={3} borderColor="#edf2f2">
                                            <Text fontSize="10px" fontWeight="700" color="#40565d" wordBreak="break-word">{item?.food_name || "—"}</Text>
                                        </Td>

                                        {[1,2,3,4,5,6,7].map(nvlIdx => {
                                            const name = item[`NVL${nvlIdx}`];
                                            const dvt = item[`NVL${nvlIdx}_DVT`];
                                            const dm = item[`NVL${nvlIdx}_DM`];
                                            return (
                                                <Td key={nvlIdx} px={3} py={3} borderColor="#edf2f2" verticalAlign="top">
                                                    {name ? (
                                                        <div>
                                                            <div className="break-words text-[10px] font-semibold leading-[1.3] text-[#53676d]">{name}</div>
                                                            <span className="mt-1 inline-flex rounded-md bg-[#f2f6f6] px-1.5 py-0.5 text-[8px] text-[#7d8b90]">{dm} {dvt}</span>
                                                        </div>
                                                    ) : <span className="text-[10px] text-[#b1bcbe]">—</span>}
                                                </Td>
                                            );
                                        })}

                                        

                                        <Td px={2} py={3} borderColor="#edf2f2">
                                            <button type="button" className="rounded-[7px] border border-[#cfe2e4] bg-white px-2 py-1 text-[9px] font-semibold text-[#528b92] hover:bg-[#f1f8f8]">✎ Sửa</button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>

                    {!paginatedBomMonAns.length && (
                        <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
                            <Icon as={MdSettings} boxSize={5} color="#67aab1"/>
                            <p className="mt-2 text-sm font-semibold text-[#596b72]">Không có dữ liệu</p>
                        </div>
                    )}

                    <Flex align="center" justify="space-between" flexWrap="wrap" gap={3} px={5} py={3} borderTop="1px solid #edf2f2" bg="#fcfefe">
                        <Text fontSize="10px" color="#7e8d92">
                            {filteredBomMonAns.length ? `${currentPage * pageSize + 1}-${Math.min((currentPage + 1) * pageSize, filteredBomMonAns.length)} / ${filteredBomMonAns.length} món` : "0 món"}
                        </Text>

                        <ReactPaginate
                            previousLabel="‹"
                            nextLabel="›"
                            breakLabel="..."
                            pageCount={Math.max(pageCount,1)}
                            forcePage={currentPage}
                            onPageChange={(selectedItem) => setCurrentPage(selectedItem.selected)}
                            containerClassName="flex items-center gap-1"
                            pageClassName="inline-flex"
                            pageLinkClassName="inline-flex h-7 min-w-7 items-center justify-center rounded-[7px] border border-[#dce6e7] bg-white px-2 text-[9px] font-semibold text-[#66777d] hover:bg-[#f1f8f7]"
                            previousClassName="inline-flex"
                            previousLinkClassName="inline-flex h-7 min-w-7 items-center justify-center rounded-[7px] border border-[#dce6e7] bg-white px-2 text-[13px] text-[#66777d]"
                            nextClassName="inline-flex"
                            nextLinkClassName="inline-flex h-7 min-w-7 items-center justify-center rounded-[7px] border border-[#dce6e7] bg-white px-2 text-[13px] text-[#66777d]"
                            activeClassName="inline-flex"
                            activeLinkClassName="!border-[#69aaa6] !bg-[#69aaa6] !text-white"
                            disabledClassName="opacity-40"
                        />
                    </Flex>
                </section>
            </div>
        </div>
    </main>
)
}

export default BOMMonAn;