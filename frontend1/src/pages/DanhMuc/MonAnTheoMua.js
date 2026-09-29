import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { 
    Flex, Heading, Input, Button, ButtonGroup, Text, CircularProgress, CircularProgressLabel,
    InputGroup, InputLeftElement, InputRightElement, Icon, IconButton, Select,
    Stack, HStack, Image, Wrap, WrapItem, Center, InputRightAddon,
    Tabs, Tab, TabList, TabPanels, TabPanel,
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, useDisclosure, useToast
} from '@chakra-ui/react';
import ReactPaginate from 'react-paginate';
import { MdSettings, MdAdd, MdAddCircleOutline, MdCalendarToday, MdSearch, MdEdit, MdDeleteForever, MdSave } from 'react-icons/md';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormattedDate, FormattedTime } from 'react-intl';
import { sleep } from "../../utils/helpers";
import MonAnKhuyenKhich from './MonAnKhuyenKhich';
import MonAnLoaiTru from './MonAnLoaiTru';
import httpClient from '../../services/http-client';

function monthOf(row) {
    return {
        start: row.start_month ?? row.thang_bat_dau ?? row.from_month ?? '',
        end: row.end_month ?? row.thang_ket_thuc ?? row.to_month ?? '',
    };
}

function MonAnTheoMua() {
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);
    const initialRef = useRef(null);
    const toast = useToast();
    const navigate = useNavigate();
    const { search } = useLocation();
    const [limit, setLimit] = useState(25);
    const [searchText, setSearchText] = useState("");
    const [bomMonAns, setBomMonAns] = useState([]);
    const [tab, setTab] = useState('plus');
    const [rows, setRows] = useState([]);
    const [form, setForm] = useState({ food_name: '', start_month: '', end_month: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const mouted = useRef();

    const query = new URLSearchParams(search);
    const encouraged = tab === 'plus';

    useEffect(() => {
        if(!mouted.current) {
            mouted.current = true;
            load();
        }
    }, []);

    async function load() {
        setLoading(true);
        try {
            const res = await httpClient.get('/catering/mon_an_theo_muas');
            setRows(res.data?.data || []);
        } catch {
            setError('Không tải được món ăn theo mùa.');
        } finally {
            setLoading(false);
        }
    }

    const visible = useMemo(() => {
        const keyword = searchText.trim().toLowerCase();

        return rows.filter((row) =>
            Boolean(row.is_encouraged) === encouraged &&
            (!keyword ||
                String(row.food_name || '')
                    .toLowerCase()
                    .includes(keyword))
        );
    }, [rows, searchText, encouraged]);

    const paginatedRows = visible.slice(
        (page - 1) * limit,
        page * limit
    );

    const pageCount = Math.ceil(visible.length / limit);

    useEffect(() => {
        setPage(1);
    }, [searchText, tab]);

    async function save(event) {
        event.preventDefault();

        if(!form.food_name.trim() || !form.start_month || !form.end_month) {
            setError('Nhập đủ món ăn và tháng.');
            return;
        }

        setError('');
        setMessage('');
        setLoading(true);

        try {
            const res = await httpClient.post('/catering/add_mon_an_theo_mua', {
                food_name: form.food_name.trim(),
                is_encouraged: encouraged,
                from_month: Number(form.start_month),
                to_month: Number(form.end_month),
            });

            if(res.data?.error) {
                setError('Lưu thất bại. Kiểm tra tên field backend.');
                return;
            }

            setForm({
                food_name: '',
                start_month: '',
                end_month: ''
            });

            setMessage('Đã lưu.');
            await load();
        } catch {
            setError('Không gọi được API.');
        } finally {
            setLoading(false);
        }
    }

    return (
    <main className="min-h-[calc(100vh-116px)] w-full bg-[#f5f9f9] p-3 sm:p-5">
        {loading && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
                <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#dceff0] border-t-[#5faeaa]" />
            </div>
        )}

        <div className="w-full">
            <div className="mb-4 flex gap-2 border-b border-[#dfe9e8]">
                <button
                    type="button"
                    onClick={() => { setTab('plus'); setPage(1) }}
                    className={`rounded-t-[10px] px-5 py-2.5 text-[12px] font-semibold transition ${encouraged ? 'border border-b-0 border-[#d9e8e7] bg-white text-[#3f9894]' : 'text-[#71858a] hover:bg-white'}`}
                >
                    Món ăn khuyến khích
                </button>
                <button
                    type="button"
                    onClick={() => { setTab('minus'); setPage(1) }}
                    className={`rounded-t-[10px] px-5 py-2.5 text-[12px] font-semibold transition ${!encouraged ? 'border border-b-0 border-[#d9e8e7] bg-white text-[#3f9894]' : 'text-[#71858a] hover:bg-white'}`}
                >
                    Món ăn loại trừ
                </button>
            </div>

            <div className="grid w-full grid-cols-1 items-start gap-4 xl:grid-cols-[350px_minmax(0,1fr)]">
                <section className="overflow-hidden rounded-[16px] border border-[#e4eded] bg-white shadow-[0_6px_24px_rgba(43,86,89,.045)]">
                    <div className="border-b border-[#edf2f2] px-5 py-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#78aaa9]">SEASONAL MENU</div>
                                <h2 className="mt-1 text-[16px] font-semibold text-[#31474e]">
                                    {encouraged ? 'Thêm món khuyến khích' : 'Thêm món loại trừ'}
                                </h2>
                                <p className="mt-1 text-[11px] text-[#8b9a9e]">Nhập món và khoảng tháng áp dụng.</p>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${encouraged ? 'bg-[#eaf7f5] text-[#4d9992]' : 'bg-[#fff1ee] text-[#bc7769]'}`}>
                                {encouraged ? 'Khuyến khích' : 'Loại trừ'}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={save} className="p-5">
                        <div className="space-y-4">
                            <label className="block">
                                <span className="mb-1.5 block text-[11px] font-semibold text-[#5d7076]">Món ăn</span>
                                <Input
                                    value={form.food_name}
                                    placeholder="Ví dụ: Gà chiên nước mắm"
                                    onChange={(event) => setForm({ ...form, food_name: event.target.value })}
                                    h="41px"
                                    borderColor="#dfe8e9"
                                    borderRadius="10px"
                                    fontSize="12px"
                                    bg="#fcfefe"
                                    _hover={{ borderColor:"#c9dddd", bg:"white" }}
                                    _focus={{ borderColor:"#67aaa7", boxShadow:"0 0 0 3px rgba(103,170,167,.1)", bg:"white" }}
                                />
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <label className="block">
                                    <span className="mb-1.5 block text-[11px] font-semibold text-[#5d7076]">Từ tháng</span>
                                    <Select
                                        value={form.start_month}
                                        placeholder="Chọn tháng"
                                        onChange={(event) => setForm({ ...form, start_month: event.target.value })}
                                        h="41px"
                                        borderColor="#dfe8e9"
                                        borderRadius="10px"
                                        fontSize="12px"
                                        bg="#fcfefe"
                                        _focus={{ borderColor:"#67aaa7", boxShadow:"0 0 0 3px rgba(103,170,167,.1)" }}
                                    >
                                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(month => (
                                            <option key={month} value={month}>Tháng {month}</option>
                                        ))}
                                    </Select>
                                </label>

                                <label className="block">
                                    <span className="mb-1.5 block text-[11px] font-semibold text-[#5d7076]">Đến tháng</span>
                                    <Select
                                        value={form.end_month}
                                        placeholder="Chọn tháng"
                                        onChange={(event) => setForm({ ...form, end_month: event.target.value })}
                                        h="41px"
                                        borderColor="#dfe8e9"
                                        borderRadius="10px"
                                        fontSize="12px"
                                        bg="#fcfefe"
                                        _focus={{ borderColor:"#67aaa7", boxShadow:"0 0 0 3px rgba(103,170,167,.1)" }}
                                    >
                                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(month => (
                                            <option key={month} value={month}>Tháng {month}</option>
                                        ))}
                                    </Select>
                                </label>
                            </div>

                            <div className="rounded-[11px] border border-[#dceaea] bg-[#f4faf9] px-4 py-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-[11px] font-semibold text-[#50676d]">Khoảng áp dụng</div>
                                        <div className="mt-1 text-[10px] text-[#89999d]">Món sẽ thuộc nhóm hiện tại trong khoảng tháng đã chọn.</div>
                                    </div>
                                    <div className="rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-bold text-[#5a9b97] shadow-sm">
                                        {form.start_month && form.end_month ? `${form.start_month} → ${form.end_month}` : '--'}
                                    </div>
                                </div>
                            </div>

                            {message && <div className="rounded-lg border border-[#cfe4d3] bg-[#f2faf3] px-3 py-2 text-[11px] text-[#598260]">{message}</div>}
                            {error && <div className="rounded-lg border border-[#efd0cb] bg-[#fff6f4] px-3 py-2 text-[11px] text-[#b5685c]">{error}</div>}

                            <Button
                                type="submit"
                                w="100%"
                                h="41px"
                                borderRadius="10px"
                                bg="#69aaa6"
                                color="white"
                                fontSize="12px"
                                fontWeight="700"
                                leftIcon={<Icon as={MdAddCircleOutline} boxSize={4} />}
                                isDisabled={loading}
                                _hover={{ bg:"#5e9c98", transform:"translateY(-1px)" }}
                                _active={{ transform:"translateY(0)" }}
                            >
                                {loading ? 'Đang lưu...' : 'Lưu món ăn'}
                            </Button>
                        </div>
                    </form>
                </section>

                <section className="min-w-0 overflow-hidden rounded-[16px] border border-[#e4eded] bg-white shadow-[0_6px_24px_rgba(43,86,89,.045)]">
                    <div className="flex flex-col gap-3 border-b border-[#edf2f2] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#78aaa9]">DANH MỤC MÓN ĂN</div>
                            <div className="mt-1 flex items-center gap-2">
                                <h2 className="text-[16px] font-semibold text-[#31474e]">
                                    {encouraged ? 'Danh sách món khuyến khích' : 'Danh sách món loại trừ'}
                                </h2>
                                <span className="rounded-md bg-[#edf7f6] px-2 py-1 text-[9px] font-bold text-[#579b96]">{visible.length} món</span>
                            </div>
                        </div>

                        <InputGroup w={{ base:"100%", lg:"220px" }}>
                            <InputLeftElement pointerEvents="none">
                                <Icon as={MdSearch} boxSize={3.5} color="#8b999e" />
                            </InputLeftElement>
                            <Input
                                value={searchText}
                                onChange={(event) => { setSearchText(event.target.value); setPage(1) }}
                                placeholder="Tìm món ăn..."
                                h="36px"
                                pl="34px"
                                borderColor="#dfe8e9"
                                borderRadius="9px"
                                fontSize="11px"
                                bg="#fcfefe"
                                _focus={{ borderColor:"#67aaa7", boxShadow:"0 0 0 3px rgba(103,170,167,.1)" }}
                            />
                        </InputGroup>
                    </div>

                    <TableContainer maxH="calc(100vh - 285px)" overflowY="auto" overflowX="auto">
                        <Table variant="simple" size="sm" layout="fixed" minW="680px">
                            <Thead position="sticky" top={0} zIndex={2} bg="#eef6f5">
                                <Tr>
                                    <Th w="55px" px={3} py={3} fontSize="9px" color="#5d7379">STT</Th>
                                    <Th w="42%" px={3} py={3} fontSize="9px" color="#5d7379">MÓN ĂN</Th>
                                    <Th w="21%" px={3} py={3} fontSize="9px" color="#5d7379">THÁNG BẮT ĐẦU</Th>
                                    <Th w="21%" px={3} py={3} fontSize="9px" color="#5d7379">THÁNG KẾT THÚC</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {paginatedRows.map((row, index) => {
                                    const months = monthOf(row)
                                    return (
                                        <Tr key={row._id || `${row.food_name}-${index}`} _hover={{ bg:"#f7fbfa" }}>
                                            <Td px={3} py={3.5} fontSize="10px" color="#849398" borderColor="#edf2f2">
                                                {(page - 1) * limit + index + 1}
                                            </Td>
                                            <Td px={3} py={3.5} borderColor="#edf2f2">
                                                <Text fontSize="11px" fontWeight="600" color="#40565d" wordBreak="break-word">
                                                    {row.food_name || '—'}
                                                </Text>
                                            </Td>
                                            <Td px={3} py={3.5} fontSize="11px" color="#62767c" borderColor="#edf2f2">
                                                {months.start || '—'}
                                            </Td>
                                            <Td px={3} py={3.5} fontSize="11px" color="#62767c" borderColor="#edf2f2">
                                                {months.end || '—'}
                                            </Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>

                    {!paginatedRows.length && !loading && (
                        <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef7f6] text-[#61a39f]">
                                <Icon as={MdCalendarToday} boxSize={5} />
                            </div>
                            <p className="mt-3 text-sm font-semibold text-[#596d73]">Chưa có dữ liệu</p>
                            <p className="mt-1 text-[11px] text-[#8a989d]">Không tìm thấy món ăn phù hợp.</p>
                        </div>
                    )}

                    <Flex align="center" justify="space-between" flexWrap="wrap" gap={3} px={5} py={3.5} borderTop="1px solid #edf2f2" bg="#fcfefe">
                        <Text fontSize="10px" color="#7e8d92">
                            {visible.length ? `Hiển thị ${(page - 1) * limit + 1}-${Math.min(page * limit, visible.length)} / ${visible.length} món` : '0 món'}
                        </Text>
                        <ReactPaginate
                            previousLabel="‹"
                            nextLabel="›"
                            breakLabel="..."
                            pageCount={Math.max(pageCount, 1)}
                            forcePage={page - 1}
                            onPageChange={({ selected }) => setPage(selected + 1)}
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
);
    
}

export default MonAnTheoMua;