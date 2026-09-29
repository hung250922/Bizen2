import React, { useState, useEffect } from 'react';
import { Select, components} from 'chakra-react-select';
import { Flex, Box, Text, Image,  } from '@chakra-ui/react';

const Option = (props) => (
    <components.Option {...props}>
        <Flex gap={2} align="center">
            <Image alt="logo" src={props.data?.icon} maxW="119" maxH="79"/>
            <Text fontWeight="600">{props.data.label}</Text>
        </Flex>
    </components.Option>
)

export default function SelectWithImage({ id, title, datas, color, onChange }) {
    useEffect(() => {
        const firstData = datas.find(item => item.value === id);
        setSelectedItem(firstData);
    }, [datas, id]);

    const [selectedItem, setSelectedItem] = useState(null);
    //console.log("--- selectedItem", selectedItem)
    const SingleValue = ({ children, ...props }) => {
        return (
            <components.SingleValue {...props}>
                <Flex gap={1} align="center">
                    <Image alt="logo" src={props.data?.icon} maxW="119" maxH="79"/>
                    <Text fontWeight="600" color={color}>{children}</Text>
                </Flex>
            </components.SingleValue>
        )
    }

    return (
        <Select 
            // defaultValue={selectedItem}
            value={selectedItem}
            options={datas}
            onChange={
                (item) => {
                    setSelectedItem(item);
                    onChange(item.value);
                }
            }
            components={{
                Option,
                SingleValue
            }}
            //placeholder={`${title}`}
        />
    )
}