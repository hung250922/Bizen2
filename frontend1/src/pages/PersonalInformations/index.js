import { 
    Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Heading, useToast
} from '@chakra-ui/react';
import UserInformations from './UserInformations';
import CompanyInformations from './CompanyInformations';
import ChangePassword from './ChangePassword';

function Informations() {
    return (
        <Flex flexDirection="column" p={4}>
            <Heading size="lg">Thông tin chung</Heading>
            <Tabs variant="soft-rounded" colorScheme='green' p={2}>
                <TabList>
                    <Tab textTransform="uppercase">Cá nhân</Tab>
                    <Tab textTransform="uppercase">Cửa hàng</Tab>
                    <Tab textTransform="uppercase">Thay đổi mật khẩu</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <UserInformations />
                    </TabPanel>
                    <TabPanel>
                        <CompanyInformations />
                    </TabPanel>
                    <TabPanel>
                        <ChangePassword />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    )
}

export default Informations;