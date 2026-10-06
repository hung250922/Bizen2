import React, { useMemo } from 'react';
import {
    Outlet,
    useLocation,
    useNavigate,
} from 'react-router-dom';

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

import {
    FaCheck,
    FaLayerGroup,
} from 'react-icons/fa';

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


/* ============================================================
 * MENU
 * ========================================================== */

const menuItems = [
    {
        to: '/',
        label: 'Trang chủ',
        icon: MdDashboard,
    },
    {
        to: SUB_URL_MON_AN_THEO_MUA,
        label: 'Món ăn theo mùa',
        icon: MdFoodBank,
    },
    {
        to: SUB_URL_BOM_MON_AN,
        label: 'BOM món ăn',
        icon: MdInventory,
    },
    {
        to: SUB_URL_DON_GIA_NGUYEN_VAT_LIEU,
        label: 'Đơn giá nguyên vật liệu',
        icon: MdInventory2,
    },
    {
        to: SUB_URL_DON_GIA_SAN_PHAM,
        label: 'Đơn giá sản phẩm',
        icon: MdMoney,
    },
    {
        to: SUB_URL_CAU_HINH_TINH_DIEM,
        label: 'Cấu hình tính điểm',
        icon: MdTune,
    },
    {
        to: SUB_URL_PHOI_HOP_COMBO,
        label: 'Phối hợp combo',
        icon: FaLayerGroup,
    },
    {
        to: SUB_URL_LENH_SAN_XUAT,
        label: 'Lệnh sản xuất',
        icon: MdFactory,
    },
    {
        to: SUB_URL_KIEM_THUC_BA_BUOC,
        label: 'Kiểm thực ba bước',
        icon: FaCheck,
    },
    {
        to: SUB_URL_GIAY_DI_CHO,
        label: 'Giấy đi chợ',
        icon: MdShoppingCart,
    },
    {
        to: SUB_URL_MUA_HANG_PO,
        label: 'Mua hàng PO',
        icon: MdShoppingBasket,
    },
    {
        to: SUB_URL_BAO_SO_LUONG_KHACH_HANG,
        label: 'Báo số lượng (khách hàng)',
        icon: MdPerson,
    },
    {
        to: SUB_URL_BAO_SO_LUONG_QUAN_LY_SITE,
        label: 'Báo số lượng (quản lý site)',
        icon: MdPersonPinCircle,
    },
    {
        to: '/admin',
        label: 'Admin',
        icon: MdSettings,
    },
];


/* ============================================================
 * HELPERS
 * ========================================================== */

function getPageTitle(pathname) {
    if (pathname === '/') {
        return 'Trang chủ';
    }

    return (
        menuItems.find(
            (item) => item.to === pathname
        )?.label || 'Bizen Catering'
    );
}

function getPageItem(pathname) {
    return (
        menuItems.find(
            (item) => item.to === pathname
        ) || menuItems[0]
    );
}

function getUserLabel(cookieValue) {
    if (!cookieValue) {
        return 'Người dùng';
    }

    if (typeof cookieValue === 'string') {
        return cookieValue;
    }

    return (
        cookieValue.name ||
        cookieValue.email ||
        cookieValue.username ||
        'Người dùng'
    );
}


/* ============================================================
 * ICON THEMES
 * ========================================================== */

const iconThemes = [
    {
        bg: '#EAF3FF',
        color: '#4D88D7',
    },
    {
        bg: '#EEF9EF',
        color: '#5BA36C',
    },
    {
        bg: '#FFF3E6',
        color: '#DD9140',
    },
    {
        bg: '#F1ECFF',
        color: '#7B60D5',
    },
    {
        bg: '#EAF8F6',
        color: '#27988A',
    },
    {
        bg: '#FFF0F3',
        color: '#D86979',
    },
];


/* ============================================================
 * HERO BANNER
 * ========================================================== */

const BizenHeroBanner = ({
    title,
    description,
    icon: PageIcon = MdPerson,
}) => {
    return (
        <Box
            position="relative"
            overflow="hidden"
            minH={{
                base: '150px',
                md: '140px',
                xl: '145px',
            }}
            rounded="18px"
            border="1px solid"
            borderColor="#DDDDDD"
            bg="#F2FAF7"
        >

            {/* =================================================
             * BACKGROUND
             * =============================================== */}

            <Box
                position="absolute"
                inset={0}
                bg="linear-gradient(105deg, #F1FBF8 0%, #F8FCFB 50%, #E8F7F1 100%)"
            />

            <Box
                position="absolute"
                top="-110px"
                left="-80px"
                w="300px"
                h="300px"
                rounded="full"
                bg="#DDF4ED"
                opacity={0.85}
                filter="blur(42px)"
            />

            <Box
                position="absolute"
                top="-100px"
                left="40%"
                w="250px"
                h="250px"
                rounded="full"
                bg="#E6F7F1"
                opacity={0.8}
                filter="blur(38px)"
            />

            <Box
                position="absolute"
                right="16%"
                bottom="-150px"
                w="320px"
                h="320px"
                rounded="full"
                bg="#F0FAF6"
                opacity={0.9}
                filter="blur(45px)"
            />


            {/* =================================================
             * DECORATION
             * =============================================== */}

            <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 1200 215"
                preserveAspectRatio="none"
                fill="none"
            >
                <path
                    d="M820 25C858 54 884 105 905 168"
                    stroke="#78BCAE"
                    strokeWidth="1.4"
                    opacity=".48"
                />

                <path
                    d="M765 47C792 24 818 30 830 52C803 63 782 59 765 47Z"
                    fill="#83CAB9"
                    opacity=".48"
                />

                <path
                    d="M800 78C829 54 854 62 864 85C835 97 815 91 800 78Z"
                    fill="#67B7A6"
                    opacity=".42"
                />

                <path
                    d="M844 40C865 20 887 25 895 46C874 53 857 50 844 40Z"
                    fill="#A2DCD0"
                    opacity=".6"
                />

                <path
                    d="M868 93C895 72 919 79 928 101C901 110 883 106 868 93Z"
                    fill="#75C2B0"
                    opacity=".44"
                />

                <path
                    d="M915 56C940 38 963 44 971 66C946 75 929 69 915 56Z"
                    fill="#9ED7CB"
                    opacity=".5"
                />

                <path
                    d="M880 70C861 55 844 60 839 77C858 84 872 79 880 70Z"
                    fill="#A7DDD2"
                    opacity=".5"
                />

                <circle
                    cx="740"
                    cy="152"
                    r="3"
                    fill="#79BFAF"
                    opacity=".55"
                />

                <circle
                    cx="760"
                    cy="166"
                    r="2"
                    fill="#9AD5CA"
                    opacity=".7"
                />

                <circle
                    cx="990"
                    cy="46"
                    r="3"
                    fill="#70B8A7"
                    opacity=".5"
                />
            </svg>


            {/* =================================================
             * FOOD IMAGE
             * =============================================== */}

            {/* =====================================================
 * FOOD IMAGE - CROP PHẦN CHỮ TRONG ẢNH
 * =================================================== */}

<Box
    position="absolute"
    top={0}
    right={0}
    bottom={0}
    w={{
        base: '150px',
        sm: '185px',
        md: '235px',
        xl: '290px',
    }}
    overflow="hidden"
    zIndex={2}
>
    <img
        src="/images/bizen-hero-food.png"
        alt=""
        className="
            absolute
            right-[-8%]
            top-1/2
            h-[125%]
            w-[125%]
            max-w-none
            -translate-y-1/2
            object-cover
            object-right
        "
    />
</Box>


            {/* Image fade */}

            <Box
                position="absolute"
                top={0}
                bottom={0}
                right={{
                    base: '145px',
                    sm: '180px',
                    md: '230px',
                    xl: '285px',
                }}
                w="120px"
                zIndex={3}
                bg="linear-gradient(
                    90deg,
                    rgba(241,251,248,1),
                    rgba(241,251,248,0)
                )"
            />


            {/* =================================================
             * SLOGAN
             * =============================================== */}

            <Box
                display={{
                    base: 'none',
                    lg: 'block',
                }}
                position="absolute"
                right={{
                    lg: '235px',
                    xl: '290px',
                }}
                top="50%"
                transform="translateY(-50%) rotate(-5deg)"
                zIndex={5}
                textAlign="center"
            >
                <Text
                    fontFamily="'Segoe Script', cursive"
                    fontSize={{
                        lg: '13px',
                        xl: '16px',
                    }}
                    fontStyle="italic"
                    fontWeight="600"
                    lineHeight="1.2"
                    color="#419D90"
                >
                    Fresh Food
                    <br />
                    Better Life ♡
                </Text>

                <Box
                    mx="auto"
                    mt={1}
                    h="1px"
                    w="70px"
                    bg="#65B2A6"
                />
            </Box>


            {/* =================================================
             * CONTENT
             * =============================================== */}

            <Flex
                position="relative"
                zIndex={6}
                align="center"
                minH={{
                    base: '150px',
                    md: '140px',
                    xl: '145px',
                }}
                px={{
                    base: 5,
                    md: 7,
                    xl: 8,
                }}
                py={4}
            >
                <Box
                    maxW={{
                        base: '100%',
                        md: '68%',
                        xl: '65%',
                    }}
                >

                    {/* Breadcrumb */}

                    <HStack
                        spacing={2}
                        mb={2.5}
                    >
                        <Box
                            h="6px"
                            w="6px"
                            rounded="full"
                            bg="#35A293"
                        />

                        <Text
                            fontSize="8px"
                            fontWeight="700"
                            color="#669890"
                        >
                            Bizen Catering
                        </Text>

                        <Text
                            fontSize="8px"
                            color="#B4C4C1"
                        >
                            /
                        </Text>

                        <Text
                            fontSize="8px"
                            color="#819793"
                        >
                            Hệ thống quản lý
                        </Text>
                    </HStack>


                    {/* Title */}

                    <HStack
                        spacing={3}
                        align="flex-start"
                    >

                        <Box
                            display={{
                                base: 'none',
                                md: 'grid',
                            }}
                            placeItems="center"
                            flexShrink={0}
                            w="44px"
                            h="44px"
                            rounded="13px"
                            bg="#DDF4ED"
                            color="#178D7D"
                        >
                            <PageIcon size={22} />
                        </Box>


                        <Box>

                            <Heading
                                fontFamily="Space Grotesk, sans-serif"
                                fontSize={{
                                    base: '21px',
                                    md: '25px',
                                    xl: '28px',
                                }}
                                fontWeight="800"
                                letterSpacing="-0.025em"
                                lineHeight="1.1"
                                color="#173B51"
                            >
                                {title}
                            </Heading>

                            <Text
                                mt={1.5}
                                maxW="560px"
                                fontSize={{
                                    base: '9px',
                                    md: '10px',
                                }}
                                lineHeight="1.5"
                                fontWeight="500"
                                color="#71868D"
                            >
                                {description}
                            </Text>


                            {/* Features */}

                            <HStack
                                spacing={2}
                                mt={3}
                                flexWrap="wrap"
                            >

                                <HStack
                                    spacing={1.5}
                                    px={2.5}
                                    py={1}
                                    rounded="full"
                                    bg="rgba(255,255,255,.72)"
                                    border="1px solid"
                                    borderColor="#D8ECE6"
                                >
                                    <Box
                                        display="grid"
                                        placeItems="center"
                                        h="17px"
                                        w="17px"
                                        rounded="full"
                                        bg="#E2F6EF"
                                        color="#219781"
                                        fontSize="9px"
                                        fontWeight="800"
                                    >
                                        ✓
                                    </Box>

                                    <Text
                                        fontSize="8px"
                                        fontWeight="700"
                                        color="#4D8D84"
                                    >
                                        Chính xác
                                    </Text>
                                </HStack>


                                <HStack
                                    spacing={1.5}
                                    px={2.5}
                                    py={1}
                                    rounded="full"
                                    bg="rgba(255,255,255,.72)"
                                    border="1px solid"
                                    borderColor="#D8ECE6"
                                >
                                    <Box
                                        display="grid"
                                        placeItems="center"
                                        h="17px"
                                        w="17px"
                                        rounded="full"
                                        bg="#E7F7F2"
                                        color="#2B9B88"
                                        fontSize="9px"
                                    >
                                        ⚡
                                    </Box>

                                    <Text
                                        fontSize="8px"
                                        fontWeight="700"
                                        color="#4D8D84"
                                    >
                                        Nhanh chóng
                                    </Text>
                                </HStack>


                                <HStack
                                    spacing={1.5}
                                    px={2.5}
                                    py={1}
                                    rounded="full"
                                    bg="rgba(255,255,255,.72)"
                                    border="1px solid"
                                    borderColor="#D8ECE6"
                                >
                                    <Box
                                        display="grid"
                                        placeItems="center"
                                        h="17px"
                                        w="17px"
                                        rounded="full"
                                        bg="#E7F7F2"
                                        color="#2B9B88"
                                        fontSize="9px"
                                    >
                                        ♥
                                    </Box>

                                    <Text
                                        fontSize="8px"
                                        fontWeight="700"
                                        color="#4D8D84"
                                    >
                                        Hiệu quả
                                    </Text>
                                </HStack>

                            </HStack>
                        </Box>
                    </HStack>
                </Box>
            </Flex>


            {/* Accent */}

            <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                h="3px"
                bg="linear-gradient(
                    90deg,
                    #A7DCD3,
                    #3DA295,
                    #C9EAE2
                )"
                zIndex={10}
            />
        </Box>
    );
};


/* ============================================================
 * MAIN LAYOUT
 * ========================================================== */

function ModernLayout() {

    const navigate = useNavigate();

    const { pathname } =
        useLocation();

    const [
        cookies,
        ,
        removeCookie,
    ] = useCookies([
        'loginCookie',
    ]);

    const {
        isOpen,
        onOpen,
        onClose,
    } = useDisclosure();

    const isMobile =
        useBreakpointValue({
            base: true,
            lg: false,
        });


    const pageTitle = useMemo(
        () =>
            getPageTitle(
                pathname
            ),
        [pathname]
    );


    const pageItem = useMemo(
        () =>
            getPageItem(
                pathname
            ),
        [pathname]
    );


    const userLabel = useMemo(
        () =>
            getUserLabel(
                cookies.loginCookie
            ),
        [cookies.loginCookie]
    );


    /* ============================================================
     * NAVIGATION
     * ========================================================== */

    const navigateTo = (
        path
    ) => {
        onClose();
        navigate(path);
    };


    /* ============================================================
     * LOGOUT
     * ========================================================== */

    const handleLogout =
        () => {

            removeCookie(
                'loginCookie',
                {
                    path: '/',
                }
            );

            navigate('/login');
        };


    /* ============================================================
     * SIDEBAR
     * ========================================================== */

    const SidebarContent = (

        <Flex
            direction="column"
            h="100%"
            bg="#FFFFFF"
            overflow="hidden"
        >

            {/* =================================================
             * LOGO
             * =============================================== */}

            <Flex
                h="78px"
                px={5}
                align="center"
                flexShrink={0}
                borderBottom="1px solid"
                borderColor="#DDDDDD"
            >
                <img
                    src={`/images/${COMPANY_LOGO}`}
                    alt="Bizen"
                    style={{
                        height: '40px',
                        width: 'auto',
                        objectFit:
                            'contain',
                    }}
                />
            </Flex>


            {/* =================================================
             * MENU
             * =============================================== */}

            <Box
                flex="1"
                overflowY="auto"
                px={3}
                py={4}
            >

                <Text
                    px={2.5}
                    mb={3}
                    fontSize="9px"
                    fontWeight="800"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                    color="#A0A0A0"
                >
                    Danh mục
                </Text>


                <VStack
                    spacing={1}
                    align="stretch"
                >

                    {menuItems.map(
                        (
                            item,
                            index
                        ) => {

                            const ItemIcon =
                                item.icon;

                            const active =
                                item.to === '/'
                                    ? pathname === '/'
                                    : pathname ===
                                      item.to;

                            const theme =
                                iconThemes[
                                    index %
                                        iconThemes.length
                                ];


                            return (

                                <Button
                                    key={
                                        item.to
                                    }
                                    onClick={() =>
                                        navigateTo(
                                            item.to
                                        )
                                    }
                                    variant="ghost"
                                    justifyContent="flex-start"
                                    position="relative"
                                    h="42px"
                                    px={2}
                                    rounded="10px"
                                    bg={
                                        active
                                            ? '#ECF8F5'
                                            : 'transparent'
                                    }
                                    color={
                                        active
                                            ? '#148879'
                                            : '#59666E'
                                    }
                                    fontSize="11px"
                                    fontWeight={
                                        active
                                            ? '700'
                                            : '500'
                                    }
                                    leftIcon={

                                        <Box
                                            display="grid"
                                            placeItems="center"
                                            w="30px"
                                            h="30px"
                                            rounded="9px"
                                            bg={
                                                active
                                                    ? '#DDF3ED'
                                                    : theme.bg
                                            }
                                            color={
                                                active
                                                    ? '#168B7C'
                                                    : theme.color
                                            }
                                        >
                                            <ItemIcon
                                                size={15}
                                            />
                                        </Box>

                                    }
                                    rightIcon={
                                        active ? (
                                            <FiChevronRight
                                                size={
                                                    13
                                                }
                                            />
                                        ) : undefined
                                    }
                                    _hover={{
                                        bg: active
                                            ? '#ECF8F5'
                                            : '#F5F7F7',
                                        color: active
                                            ? '#148879'
                                            : '#303940',
                                    }}
                                >

                                    <Text
                                        noOfLines={1}
                                        textAlign="left"
                                    >
                                        {
                                            item.label
                                        }
                                    </Text>


                                    {active && (
                                        <Box
                                            position="absolute"
                                            left={0}
                                            top="7px"
                                            bottom="7px"
                                            w="3px"
                                            rounded="full"
                                            bg="#168B7C"
                                        />
                                    )}

                                </Button>
                            );
                        }
                    )}

                </VStack>
            </Box>


            {/* =================================================
             * USER
             * =============================================== */}

            <Box
                p={3}
                flexShrink={0}
                borderTop="1px solid"
                borderColor="#DDDDDD"
                bg="#FCFCFC"
            >

                <HStack
                    spacing={3}
                    px={2}
                    py={2}
                >

                    <Avatar
                        size="sm"
                        name={userLabel}
                        bg="#57A49A"
                        color="#FFFFFF"
                        fontSize="10px"
                    />

                    <Box
                        flex="1"
                        minW={0}
                    >

                        <Text
                            fontSize="11px"
                            fontWeight="700"
                            color="#30383D"
                            noOfLines={1}
                        >
                            {userLabel}
                        </Text>

                        <Text
                            mt="1px"
                            fontSize="8px"
                            color="#9D9D9D"
                        >
                            Quản lý
                        </Text>

                    </Box>

                </HStack>


                <Button
                    onClick={
                        handleLogout
                    }
                    variant="ghost"
                    w="100%"
                    h="36px"
                    justifyContent="flex-start"
                    px={3}
                    rounded="8px"
                    fontSize="10px"
                    fontWeight="600"
                    color="#D55D5D"
                    leftIcon={
                        <FiLogOut
                            size={14}
                        />
                    }
                    _hover={{
                        bg: '#FFF4F4',
                    }}
                >
                    Đăng xuất
                </Button>
            </Box>
        </Flex>
    );


    /* ============================================================
     * RETURN
     * ========================================================== */

    return (

        <Box
            minH="100vh"
            bg="#F4F6F7"
        >

            {/* =====================================================
             * MOBILE DRAWER
             * =================================================== */}

            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                size="xs"
            >

                <DrawerOverlay
                    bg="blackAlpha.300"
                    backdropFilter="blur(4px)"
                />

                <DrawerContent
                    maxW="280px"
                >
                    <DrawerCloseButton />

                    {SidebarContent}
                </DrawerContent>

            </Drawer>


            {/* =====================================================
             * DESKTOP SIDEBAR
             * =================================================== */}

            <Box
                display={{
                    base: 'none',
                    lg: 'block',
                }}
                position="fixed"
                top={0}
                bottom={0}
                left={0}
                w="240px"
                zIndex={30}
                bg="#FFFFFF"
                borderRight="1px solid"
                borderColor="#DDDDDD"
            >
                {SidebarContent}
            </Box>


            {/* =====================================================
             * MAIN
             * =================================================== */}

            <Flex
                direction="column"
                minH="100vh"
                ml={{
                    base: 0,
                    lg: '240px',
                }}
            >

                {/* =================================================
                 * HEADER
                 * =============================================== */}

                <Box
                    position="sticky"
                    top={0}
                    zIndex={20}
                    h={{
                        base: '58px',
                        lg: '62px',
                    }}
                    bg="#FFFFFF"
                    borderBottom="1px solid"
                    borderColor="#DDDDDD"
                >

                    <Flex
                        h="100%"
                        align="center"
                        justify="space-between"
                        px={{
                            base: 4,
                            md: 6,
                            xl: 7,
                        }}
                    >

                        {/* LEFT */}

                        <HStack
                            spacing={3}
                            minW={0}
                        >

                            {isMobile && (
                                <IconButton
                                    aria-label="Mở menu"
                                    icon={
                                        <FiMenu
                                            size={19}
                                        />
                                    }
                                    variant="ghost"
                                    rounded="8px"
                                    onClick={
                                        onOpen
                                    }
                                    color="#637178"
                                />
                            )}


                            {!isMobile && (
                                <HStack spacing={2}>
                                    <Box
                                        h="7px"
                                        w="7px"
                                        rounded="full"
                                        bg="#49A99B"
                                    />

                                    <Text
                                        fontSize="9px"
                                        fontWeight="700"
                                        letterSpacing=".1em"
                                        color="#929A9D"
                                    >
                                        HỆ THỐNG QUẢN LÝ
                                    </Text>
                                </HStack>
                            )}

                        </HStack>


                        {/* RIGHT */}

                        <HStack
                            spacing={{
                                base: 2,
                                md: 3,
                            }}
                        >

                            <Box
                                position="relative"
                            >
                                <IconButton
                                    aria-label="Thông báo"
                                    icon={
                                        <FiBell
                                            size={16}
                                        />
                                    }
                                    variant="ghost"
                                    size="sm"
                                    rounded="8px"
                                    color="#69767C"
                                    _hover={{
                                        bg: '#F5F5F5',
                                    }}
                                />

                                <Box
                                    position="absolute"
                                    top="6px"
                                    right="6px"
                                    h="6px"
                                    w="6px"
                                    bg="#E36868"
                                    rounded="full"
                                    border="1px solid white"
                                />
                            </Box>


                            <Box
                                h="26px"
                                w="1px"
                                bg="#DDDDDD"
                            />


                            <HStack spacing={2}>

                                <Avatar
                                    size="sm"
                                    name={userLabel}
                                    bg="#57A49A"
                                    color="white"
                                    fontSize="10px"
                                />

                                <Box
                                    display={{
                                        base: 'none',
                                        sm: 'block',
                                    }}
                                >
                                    <Text
                                        fontSize="10px"
                                        fontWeight="700"
                                        color="#30383D"
                                        noOfLines={1}
                                        maxW="130px"
                                    >
                                        {userLabel}
                                    </Text>

                                    <Text
                                        mt="1px"
                                        fontSize="8px"
                                        color="#A0A0A0"
                                    >
                                        Quản lý
                                    </Text>
                                </Box>

                            </HStack>

                        </HStack>
                    </Flex>
                </Box>


                {/* =================================================
                 * PAGE
                 * =============================================== */}

                <Box
                    flex="1"
                    w="100%"
                    maxW="1700px"
                    mx="auto"
                    px={{
                        base: 0,
                        md: 5,
                        xl: 7,
                    }}
                    py={{
                        base: 0,
                        md: 5,
                        xl: 5,
                    }}
                >

                    {/* =================================================
                     * HERO
                     * =============================================== */}

                    <BizenHeroBanner
                        title={pageTitle}
                        description={
                            pageTitle ===
                            'Báo số lượng (khách hàng)'
                                ? 'Theo dõi và quản lý số lượng thực phẩm cho khách hàng một cách chính xác và hiệu quả.'
                                : 'Quản lý dữ liệu và vận hành Bizen Catering một cách trực quan và hiệu quả.'
                        }
                        icon={
                            pageItem.icon
                        }
                    />


                    {/* =================================================
                     * OUTLET
                     * =============================================== */}

                    <Box
                        mt={5}
                        bg="#FFFFFF"
                        border="1px solid"
                        borderColor="#DDDDDD"
                        rounded="16px"
                        overflow="hidden"
                        minH={{
                            base: 'calc(100vh - 280px)',
                            md: 'calc(100vh - 300px)',
                        }}
                    >
                        <Outlet />
                    </Box>

                </Box>

            </Flex>
        </Box>
    );
}


export default ModernLayout;