import React, {useState, useRef, useEffect} from 'react';
import { useCookies } from 'react-cookie';
import moment from 'moment/moment';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { 
    SUB_URL_BAO_SO_LUONG_KHACH_HANG, SUB_URL_BAO_SO_LUONG_QUAN_LY_SITE, SUB_URL_MON_AN_THEO_MUA, 
    SUB_URL_CAU_HINH_TINH_DIEM, SUB_URL_BOM_MON_AN, SUB_URL_DON_GIA_NGUYEN_VAT_LIEU, SUB_URL_DON_GIA_SAN_PHAM, SUB_URL_PHOI_HOP_COMBO,
    SUB_URL_LENH_SAN_XUAT, SUB_URL_KIEM_THUC_BA_BUOC, SUB_URL_GIAY_DI_CHO, SUB_URL_MUA_HANG_PO,
} from "../constants";
import { 
    Flex, Box, VStack, Heading, Button, ButtonGroup, Text, Icon, IconButton, FormControl, FormLabel, Input,
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Alert, AlertIcon, AlertDescription, Select,
    Center, CircularProgress, CircularProgressLabel, useToast,
    HStack
} from '@chakra-ui/react';
import { MdSave, MdFileUpload, MdDeleteForever } from 'react-icons/md';
import Dashboard from './Dashboard';
import MonAnTheoMua from './DanhMuc/MonAnTheoMua';
import BaoSoLuongKhachHang from './BaoSoLuong/BaoSoLuongKhachHang';
import BaoSoLuongQuanLySite from './BaoSoLuong/BaoSoLuongQuanLySite';
import CauHinhTinhDiem from './Config/CauHinhTinhDiem';
import Admin from './Admin';
import BOMMonAn from './DanhMuc/BOMMonAn';
import DonGiaNVL from './DanhMuc/DonGiaNVL';
import DonGiaSanPham from './DanhMuc/DonGiaSanPham';
import PhoiHopCombo from './DanhMuc/PhoiHopCombo';
import LenhSanXuat from './LenhSanXuat/LenhSanXuat';
import KiemThucBaBuoc from './KiemThucBaBuoc/KiemThucBaBuoc';
import GiayDiCho from './GiayDiCho/GiayDiCho';
import MuaHangPO from './MuaHangPO/MuaHangPO';

function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [ isProcessing, setIsProcessing ] = useState(false);

    const toast = useToast();
    const mounted = useRef();
    const locations = useLocation();
    
    useEffect(() => {
        if(!mounted.current) {
            mounted.current = true;
        }
    }, []);

    return (
        <Box className="bizen-legacy-page" w="100%" h="100%" bg="transparent">
            <Flex flexDirection={{ base: "column", md: "row", lg: "row" }} justify="flex-start" gap={{ base: 4, md: 4, lg: 4 }}>
                { locations.pathname === "/" && <Dashboard /> }
                { locations.pathname === SUB_URL_MON_AN_THEO_MUA && <MonAnTheoMua /> }
                { locations.pathname === SUB_URL_BAO_SO_LUONG_KHACH_HANG && <BaoSoLuongKhachHang /> }
                { locations.pathname === SUB_URL_BAO_SO_LUONG_QUAN_LY_SITE && <BaoSoLuongQuanLySite /> }
                { locations.pathname === SUB_URL_CAU_HINH_TINH_DIEM && <CauHinhTinhDiem /> }
                { locations.pathname === SUB_URL_BOM_MON_AN && <BOMMonAn /> }
                { locations.pathname === SUB_URL_DON_GIA_NGUYEN_VAT_LIEU && <DonGiaNVL /> }
                { locations.pathname === SUB_URL_DON_GIA_SAN_PHAM && <DonGiaSanPham /> }
                { locations.pathname === SUB_URL_PHOI_HOP_COMBO && <PhoiHopCombo /> }
                { locations.pathname === SUB_URL_LENH_SAN_XUAT && <LenhSanXuat /> }
                { locations.pathname === SUB_URL_KIEM_THUC_BA_BUOC && <KiemThucBaBuoc /> }
                { locations.pathname === SUB_URL_GIAY_DI_CHO && <GiayDiCho /> }
                { locations.pathname === SUB_URL_MUA_HANG_PO && <MuaHangPO /> }
            </Flex>
        </Box>
    )
}

export default Home;