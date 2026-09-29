import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  IconButton,
  Avatar,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  FiMenu,
  FiLogOut,
  FiChevronRight,
  FiBell,
  FiCalendar,
} from 'react-icons/fi';
import {
  MdDashboard,
  MdFoodBank,
  MdInventory,
  MdInventory2,
  MdMoney,
  MdFactory,
  MdShoppingCart,
  MdShoppingBasket,
  MdPerson,
  MdPersonPinCircle,
  MdSettings,
  MdTune,
} from 'react-icons/md';
import { FaCheck, FaLayerGroup } from 'react-icons/fa';
import {
  COMPANY_LOGO,
  SUB_URL_BAO_SO_LUONG_KHACH_HANG,
  SUB_URL_BAO_SO_LUONG_QUAN_LY_SITE,
  SUB_URL_MON_AN_THEO_MUA,
  SUB_URL_CAU_HINH_TINH_DIEM,
  SUB_URL_BOM_MON_AN,
  SUB_URL_DON_GIA_NGUYEN_VAT_LIEU,
  SUB_URL_DON_GIA_SAN_PHAM,
  SUB_URL_PHOI_HOP_COMBO,
  SUB_URL_LENH_SAN_XUAT,
  SUB_URL_KIEM_THUC_BA_BUOC,
  SUB_URL_GIAY_DI_CHO,
  SUB_URL_MUA_HANG_PO,
} from '../constants';

const menuItems = [
  { to: '/', label: 'Trang chủ', icon: MdDashboard },
  { to: SUB_URL_MON_AN_THEO_MUA, label: 'Món ăn theo mùa', icon: MdFoodBank },
  { to: SUB_URL_BOM_MON_AN, label: 'BOM món ăn', icon: MdInventory },
  { to: SUB_URL_DON_GIA_NGUYEN_VAT_LIEU, label: 'Đơn giá nguyên vật liệu', icon: MdInventory2 },
  { to: SUB_URL_DON_GIA_SAN_PHAM, label: 'Đơn giá sản phẩm', icon: MdMoney },
  { to: SUB_URL_CAU_HINH_TINH_DIEM, label: 'Cấu hình tính điểm', icon: MdTune },
  { to: SUB_URL_PHOI_HOP_COMBO, label: 'Phối hợp combo', icon: FaLayerGroup },
  { to: SUB_URL_LENH_SAN_XUAT, label: 'Lệnh sản xuất', icon: MdFactory },
  { to: SUB_URL_KIEM_THUC_BA_BUOC, label: 'Kiểm thực ba bước', icon: FaCheck },
  { to: SUB_URL_GIAY_DI_CHO, label: 'Giấy đi chợ', icon: MdShoppingCart },
  { to: SUB_URL_MUA_HANG_PO, label: 'Mua hàng PO', icon: MdShoppingBasket },
  { to: SUB_URL_BAO_SO_LUONG_KHACH_HANG, label: 'Báo số lượng (khách hàng)', icon: MdPerson },
  { to: SUB_URL_BAO_SO_LUONG_QUAN_LY_SITE, label: 'Báo số lượng (quản lý site)', icon: MdPersonPinCircle },
  { to: '/admin', label: 'Admin', icon: MdSettings },
];

function getPageTitle(pathname) {
  if (pathname === '/') return 'Trang chủ';
  return menuItems.find((item) => item.to === pathname)?.label || 'Bizen Catering';
}

function getUserLabel(cookieValue) {
  if (!cookieValue) return 'Người dùng';
  if (typeof cookieValue === 'string') return cookieValue;
  return cookieValue.name || cookieValue.email || cookieValue.username || 'Người dùng';
}

function ModernLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [cookies, , removeCookie] = useCookies(['loginCookie']);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const pageTitle = useMemo(() => getPageTitle(pathname), [pathname]);
  const userLabel = useMemo(() => getUserLabel(cookies.loginCookie), [cookies.loginCookie]);

  const navigateTo = (path) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    removeCookie('loginCookie', { path: '/' });
    navigate('/login');
  };

  // ==================== SIDEBAR ====================
  const SidebarContent = (
    <Flex direction="column" h="100%" bg="white" rounded={{ lg: '2xl' }} overflow="hidden">
      {/* Logo */}
      <Flex h="80px" align="center" px={5} flexShrink={0}>
        <img
          src={`/images/${COMPANY_LOGO}`}
          alt="Bizen"
          style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
        />
      </Flex>

      {/* Menu */}
      <Box flex="1" overflowY="auto" px={3} py={1}>
        <VStack spacing="4px" align="stretch">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = item.to === '/' ? pathname === '/' : pathname === item.to;

            return (
              <Button
                key={item.to}
                onClick={() => navigateTo(item.to)}
                variant="ghost"
                justifyContent="flex-start"
                h="42px"
                px={3}
                rounded="xl"
                fontSize="13.5px"
                fontWeight={active ? '600' : '500'}
                color={active ? 'white' : 'gray.600'}
                bg={active ? 'teal.600' : 'transparent'}
                _hover={{
                  bg: active ? 'teal.600' : 'gray.100',
                  color: active ? 'white' : 'gray.800',
                }}
                leftIcon={
                  <Box color={active ? 'white' : 'gray.400'}>
                    <Icon size={18} />
                  </Box>
                }
                rightIcon={
                  active ? <FiChevronRight size={14} /> : undefined
                }
              >
                <Text noOfLines={1}>{item.label}</Text>
              </Button>
            );
          })}
        </VStack>
      </Box>

      {/* User */}
      <Box p={4} borderTop="1px solid" borderColor="gray.100">
        <HStack spacing={3} p={2.5} rounded="xl" bg="gray.50" mb={2}>
          <Avatar size="sm" name={userLabel} bg="teal.500" color="white" fontSize="13px" />
          <Box minW={0} flex="1">
            <Text fontSize="13px" fontWeight="600" noOfLines={1}>{userLabel}</Text>
            <Text fontSize="11px" color="gray.400">Quản lý</Text>
          </Box>
        </HStack>

        <Button
          onClick={handleLogout}
          variant="ghost"
          w="100%"
          justifyContent="flex-start"
          h="38px"
          rounded="xl"
          fontSize="13px"
          color="red.500"
          leftIcon={<FiLogOut size={15} />}
          _hover={{ bg: 'red.50' }}
        >
          Đăng xuất
        </Button>
      </Box>
    </Flex>
  );

  return (
    <Box minH="100vh" bg="#F1F5F9">
      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
        <DrawerContent maxW="280px" m={0}>
          <DrawerCloseButton />
          {SidebarContent}
        </DrawerContent>
      </Drawer>

      {/* ========== LAYOUT CHÍNH ========== */}
      <Flex minH="100vh" p={{ base: 0, lg: 4 }} gap={4}>

        {/* Sidebar Desktop - FLOATING */}
        <Box
          display={{ base: 'none', lg: 'block' }}
          w="260px"
          flexShrink={0}
          h="calc(100vh - 32px)"
          position="sticky"
          top={4}
          shadow="lg"
          rounded="2xl"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.100"
        >
          {SidebarContent}
        </Box>

        {/* Main Area */}
        <Flex direction="column" flex="1" minW={0}>

          {/* Header */}
          <Box
            bg="white"
            rounded={{ base: 'none', lg: '2xl' }}
            shadow="sm"
            border={{ base: 'none', lg: '1px #dddddd solid' }}
            borderColor="gray.100"
            mb={{ base: 0, lg: 4 }}
            px={{ base: 4, md: 6 }}
            py={4}
          >
            <Flex align="center" justify="space-between" gap={4}>
              <HStack spacing={3} minW={0}>
                {isMobile && (
                  <IconButton
                    aria-label="Menu"
                    icon={<FiMenu size={20} />}
                    variant="ghost"
                    onClick={onOpen}
                    rounded="xl"
                  />
                )}

                <Box minW={0}>
                  <Text fontSize="12px" color="gray.400" fontWeight="500" mb={0.5}>
                    Bizen Catering / Hệ thống quản lý
                  </Text>

                  <Heading size="md" fontWeight="700" noOfLines={1} color="gray.800">
                    {pageTitle}
                  </Heading>

                  
                  
                </Box>
              </HStack>

              <HStack spacing={3} display={{ base: 'none', md: 'flex' }}>
              

                <Box position="relative">
                  <IconButton
                    aria-label="Thông báo"
                    icon={<FiBell size={16} />}
                    variant="outline"
                    size="sm"
                    rounded="full"
                    borderColor="gray.200"
                  />

                  <Box
                    position="absolute"
                    top="6px"
                    right="6px"
                    w="7px"
                    h="7px"
                    bg="red.400"
                    rounded="full"
                    border="2px solid white"
                  />
                </Box>

                <HStack
                  spacing={2}
                  px={2}
                  py={1}
                  rounded="full"
                  border="1px solid"
                  borderColor="gray.200"
                  bg="gray.50"
                >
                  <Avatar size="xs" name={userLabel} bg="teal.500" color="white" />

                  <Text fontSize="13px" fontWeight="500" noOfLines={1} maxW="100px">
                    {userLabel}
                  </Text>
                </HStack>
              </HStack>
            </Flex>
          </Box>

          {/* Content */}
          <Box
            flex="1"
            bg="white"
            rounded={{ base: 'none', lg: '2xl' }}
            shadow="sm"
            border={{ base: 'none', lg: '1px #dddddd solid' }}
            borderColor="gray.100"
            p={{ base: '8px', lg: '12px'}}
            minH={{ base: 'calc(100vh - 80px)', lg: 'auto' }}
          >
            <Outlet />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

export default ModernLayout;