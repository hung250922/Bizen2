
const axios = require("axios");
const BIZEN_APP_ID = "cli_a95901afed389e15";
const BIZEN_APP_SECRET = "TnkH3GhyfswQszaT17rG8hYLWt2H4Ctj";

const getTenantToken = async() => {
    const GET_TENANT_ACCESS_TOKEN_URL = 'https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal';
    const response = await axios.post(GET_TENANT_ACCESS_TOKEN_URL, {
        "app_id": BIZEN_APP_ID,
        "app_secret": BIZEN_APP_SECRET
    });

    return response.data?.tenant_access_token;
}

module.exports = {
    getTenantToken
}