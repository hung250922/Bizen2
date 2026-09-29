import './App.css';
import { BrowserRouter as Router, useRoutes, Routes, Route, Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { IntlProvider } from 'react-intl';
import { CookiesProvider } from 'react-cookie';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { 
  GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, 
  SUB_URL_MON_AN_THEO_MUA, SUB_URL_BAO_SO_LUONG_KHACH_HANG, SUB_URL_BAO_SO_LUONG_QUAN_LY_SITE, SUB_URL_CAU_HINH_TINH_DIEM,
  SUB_URL_BOM_MON_AN, SUB_URL_DON_GIA_NGUYEN_VAT_LIEU, SUB_URL_DON_GIA_SAN_PHAM, SUB_URL_PHOI_HOP_COMBO, SUB_URL_LENH_SAN_XUAT,
  SUB_URL_KIEM_THUC_BA_BUOC, SUB_URL_GIAY_DI_CHO, SUB_URL_MUA_HANG_PO
} from "./constants";

import _404Page from './components/404Page';
import ProtectedRoute from './pages/Auth/ProtectedRoute';
import Login from './pages/Auth/Login';
import Admin from './pages/Admin';
import BaoSoLuongQuanLySite from './pages/BaoSoLuong/BaoSoLuongQuanLySite';
import BaoSoLuongKhachHang from './pages/BaoSoLuong/BaoSoLuongKhachHang';

import Layout from './components/Layout';
import Home from './pages/Home';

const customTheme = extendTheme({
  fonts: {
    heading: 'Space Grotesk, DM Sans, sans-serif',
    body: 'DM Sans, ui-sans-serif, system-ui, sans-serif',
  },
  colors: {
    bizen: {
      50: '#f0f9f7',
      100: '#e8f6f5',
      200: '#d8eeeb',
      300: '#b8d8d5',
      400: '#79beb8',
      500: '#49a7a2',
      600: '#318d89',
      700: '#247572',
      800: '#1f5f5d',
      900: '#174946',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#f5f8f8',
        color: '#24363d',
      },
    },
  },
});

function App() {
  return (
    <CookiesProvider>
      <ChakraProvider theme={customTheme}>
        <IntlProvider locale='vi'>
          <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
            <Router>
              <Routes>
                  <Route>
                  {/* <Route element={<ProtectedRoute />}></Route> */}
                    <Route path='/' element={<Layout />}>
                      <Route index element={<Home />}/>
                      <Route path={SUB_URL_MON_AN_THEO_MUA} element={<Home />} />
                      <Route path={SUB_URL_BAO_SO_LUONG_KHACH_HANG} element={<Home />} />
                      <Route path={SUB_URL_BAO_SO_LUONG_QUAN_LY_SITE} element={<Home />} />
                      <Route path={SUB_URL_CAU_HINH_TINH_DIEM} element={<Home />} />
                      <Route path={SUB_URL_BOM_MON_AN} element={<Home />} />
                      <Route path={SUB_URL_DON_GIA_NGUYEN_VAT_LIEU} element={<Home />} />
                      <Route path={SUB_URL_DON_GIA_SAN_PHAM} element={<Home />} />
                      <Route path={SUB_URL_PHOI_HOP_COMBO} element={<Home />} />
                      <Route path={SUB_URL_LENH_SAN_XUAT} element={<Home />} />
                      <Route path={SUB_URL_KIEM_THUC_BA_BUOC} element={<Home />} />
                      <Route path={SUB_URL_GIAY_DI_CHO} element={<Home />} />
                      <Route path={SUB_URL_MUA_HANG_PO} element={<Home />} />
                      <Route path='/admin' element={<Home />} />
                    </Route>
                  </Route>
                <Route path='/*' element={<_404Page />} />
              </Routes>
            </Router>
          </GoogleOAuthProvider>
        </IntlProvider>
      </ChakraProvider>
    </CookiesProvider>
  );
}

export default App;