import React, {useState, useEffect, useRef} from 'react';
import { 
    Flex, HStack, VStack, Text, Button, IconButton, Divider, Link
} from '@chakra-ui/react';
import { useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { 
    MdFeaturedPlayList, MdClose, MdDashboard, MdDashboardCustomize, MdImportExport, MdOutlineImportExport, 
    MdSettings, MdPerson, MdPersonPinCircle, MdFoodBank, MdInventory, MdInventory2, 
    MdDetails, MdOutlineInventory2, MdOutlineInventory, MdOutlineSettings, MdOutlinePersonPinCircle, MdMoney, MdOutlineMoney, MdOutlineFoodBank, MdOutlineDashboardCustomize, MdOutlineDashboard,
    MdFactory, MdShoppingCart, MdShoppingBasket
} from 'react-icons/md';
import { FaBars, FaCog, FaPepperHot, FaCheck } from 'react-icons/fa';
import "../../styles/index.scss";
import { 
    SUB_URL_BAO_SO_LUONG_KHACH_HANG, SUB_URL_BAO_SO_LUONG_QUAN_LY_SITE, SUB_URL_MON_AN_THEO_MUA, 
    SUB_URL_CAU_HINH_TINH_DIEM, SUB_URL_BOM_MON_AN, SUB_URL_DON_GIA_NGUYEN_VAT_LIEU, SUB_URL_DON_GIA_SAN_PHAM,
    SUB_URL_PHOI_HOP_COMBO, SUB_URL_LENH_SAN_XUAT, SUB_URL_KIEM_THUC_BA_BUOC, SUB_URL_GIAY_DI_CHO, SUB_URL_MUA_HANG_PO
} from '../../constants';

function LeftPanel({ }) {
    const locations = useLocation();
    const navigate = useNavigate();
    const [ isShowLeftPanel, setIsShowLeftPanel ] = useState(false);
    const [ cookies, setCookie, removeCookie ] = useCookies(["loginCookie"]);

    return (
        <Flex flexDirection="column" h="100vh" bg="gray.300">
            <Flex justify="flex-start" position="fixed" left={0} top={0} display={{ base: isShowLeftPanel ? "none" : "inherit", md: "none", lg: "none" }}>
                <IconButton variant="ghost" _hover="transparent" icon={<FaBars />} 
                    onClick={() => {
                        setIsShowLeftPanel(!isShowLeftPanel)
                    }}
                />
            </Flex>
           
            <Flex flexDirection="column" minW="200px" h="100%" justify="space-between"
                borderWidth={1} borderColor="gray.700" display={{ base: (isShowLeftPanel ? "inherit" : "none"), md: "inherit", lg: "inherit" }}
            >   
                <VStack>
                    <HStack>
                        <IconButton variant="ghost" _hover="transparent" icon={<MdClose />} 
                            display={{ base: (isShowLeftPanel ? "inherit" : "none"), md: "none", lg: "none" }}
                            onClick={() => {
                                setIsShowLeftPanel(!isShowLeftPanel)
                            }}
                        />
                    </HStack>

                    <Flex flexDirection="column" mt={2}>
                        <Button variant="ghost" height={8} _hover={{ opacity: 0.7 }} _active="transparent" justifyContent="flex-start" gap={2} 
                            className={(locations.pathname === "/") || (locations.pathname === "/") ? 'highlight-button' : ''} 
                            onClick={() => navigate("/")}
                        >
                            <MdDashboard /> Làm menu thực đơn tuần
                        </Button>
                        <Button variant="ghost" height={8} _hover={{ opacity: 0.7 }} _active="transparent" justifyContent="flex-start" gap={2} 
                            className={(locations.pathname === SUB_URL_MON_AN_THEO_MUA) ? 'highlight-button' : ''} 
                            onClick={() => navigate(SUB_URL_MON_AN_THEO_MUA)}
                        >
                            <MdFoodBank /> Món ăn theo mùa
                        </Button>
                        <Button variant="ghost" height={8} _hover={{ opacity: 0.7 }} _active="transparent" justifyContent="flex-start" gap={2} 
                            className={(locations.pathname === SUB_URL_BOM_MON_AN) ? 'highlight-button' : ''} 
                            onClick={() => navigate(SUB_URL_BOM_MON_AN)}
                        >
                            <MdInventory /> BOM món ăn
                        </Button>
                        <Button variant="ghost" height={8} _hover={{ opacity: 0.7 }} _active="transparent" justifyContent="flex-start" gap={2} 
                            className={(locations.pathname === SUB_URL_DON_GIA_NGUYEN_VAT_LIEU) ? 'highlight-button' : ''} 
                            onClick={() => navigate(SUB_URL_DON_GIA_NGUYEN_VAT_LIEU)}
                        >
                            <MdInventory2 /> Đơn giá nguyên vật liệu
                        </Button>
                        <Button variant="ghost" height={8} _hover={{ opacity: 0.7 }} _active="transparent" justifyContent="flex-start" gap={2} 
                            className={(locations.pathname === SUB_URL_DON_GIA_SAN_PHAM) ? 'highlight-button' : ''} 
                            onClick={() => navigate(SUB_URL_DON_GIA_SAN_PHAM)}
                        >
                            <MdMoney /> Đơn giá sản phẩm
                        </Button>
                        <Button variant="ghost" height={8} _hover={{ opacity: 0.7 }} _active="transparent" justifyContent="flex-start" gap={2} 
                            className={(locations.pathname === SUB_URL_CAU_HINH_TINH_DIEM) ? 'highlight-button' : ''} 
                            onClick={() => navigate(SUB_URL_CAU_HINH_TINH_DIEM)}
                        >
                            <MdFoodBank /> Cấu hình tính điểm
                        </Button>
                        <Button variant="ghost" height={8} _hover={{ opacity: 0.7 }} _active="transparent" justifyContent="flex-start" gap={2} 
                            className={(locations.pathname === SUB_URL_PHOI_HOP_COMBO) ? 'highlight-button' : ''} 
                            onClick={() => navigate(SUB_URL_PHOI_HOP_COMBO)}
                        >
                            <MdFoodBank /> Phối hợp combo
                        </Button>
                        <Button variant="ghost" height={8} _hover={{ opacity: 0.7 }} _active="transparent" justifyContent="flex-start" gap={2} 
                            className={(locations.pathname === SUB_URL_LENH_SAN_XUAT) ? 'highlight-button' : ''} 
                            onClick={() => navigate(SUB_URL_LENH_SAN_XUAT)}
                        >
                            <MdFactory /> Lệnh sản xuất
                        </Button>
                        <Button variant="ghost" height={8} _hover={{ opacity: 0.7 }} _active="transparent" justifyContent="flex-start" gap={2} 
                            className={(locations.pathname === SUB_URL_KIEM_THUC_BA_BUOC) ? 'highlight-button' : ''} 
                            onClick={() => navigate(SUB_URL_KIEM_THUC_BA_BUOC)}
                        >
                            <FaCheck /> Kiểm thực ba bước
                        </Button>
                        <Button variant="ghost" height={8} _hover={{ opacity: 0.7 }} _active="transparent" justifyContent="flex-start" gap={2} 
                            className={(locations.pathname === SUB_URL_GIAY_DI_CHO) ? 'highlight-button' : ''} 
                            onClick={() => navigate(SUB_URL_GIAY_DI_CHO)}
                        >
                            <MdShoppingCart /> Giấy đi chợ
                        </Button>
                        <Button variant="ghost" height={8} _hover={{ opacity: 0.7 }} _active="transparent" justifyContent="flex-start" gap={2} 
                            className={(locations.pathname === SUB_URL_MUA_HANG_PO) ? 'highlight-button' : ''} 
                            onClick={() => navigate(SUB_URL_MUA_HANG_PO)}
                        >
                            <MdShoppingBasket /> Mua hàng PO
                        </Button>
                        <Button variant="ghost" height={8} _hover={{ opacity: 0.7 }} _active="transparent" justifyContent="flex-start" gap={2} 
                            className={(locations.pathname === SUB_URL_BAO_SO_LUONG_KHACH_HANG) ? 'highlight-button' : ''} 
                            onClick={() => navigate(SUB_URL_BAO_SO_LUONG_KHACH_HANG)}
                        >
                            <MdPerson /> Báo số lượng (Khách hàng)
                        </Button>
                        <Button variant="ghost" height={8} _hover={{ opacity: 0.7 }} _active="transparent" justifyContent="flex-start" gap={2} 
                            className={(locations.pathname === SUB_URL_BAO_SO_LUONG_QUAN_LY_SITE) ? 'highlight-button' : ''} 
                            onClick={() => navigate(SUB_URL_BAO_SO_LUONG_QUAN_LY_SITE)}
                        >
                            <MdPersonPinCircle /> Báo số lượng (Quản lý site)
                        </Button>
                        <Button variant="ghost" height={8} _hover={{ opacity: 0.7 }} _active="transparent" justifyContent="flex-start" gap={2}
                            className={locations.pathname === "/admin" ? 'highlight-button' : ''} 
                            onClick={() => navigate("/admin")}
                        >
                           <MdSettings /> Admin
                        </Button>
                    </Flex>
                </VStack>
            </Flex>
        </Flex>
    )
}

export default LeftPanel;