import React from "react";
import {
    Box,
    Divider,
    HStack,
    Link,
    StackDivider,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import { FOOTER_HEIGHT } from "../constants";
import { Icon } from "@chakra-ui/icons";

type Props = {};

export const Footer: React.FunctionComponent<Props> = () => {
    const bgColor = useColorModeValue("gray.100", "gray.900");
    return (
        <>
            <Divider />
            <Box w="100%" bgColor={bgColor} color="gray.500" fontSize={15}>
                <VStack h={FOOTER_HEIGHT} py={4} spacing={0}>
                    <Box>
                        Made with <Icon as={FaHeart} color="red.500" /> by the
                        CSSE1001 team.
                    </Box>
                    <HStack divider={<StackDivider />}>
                        <Link
                            href="https://github.com/CSSE1001/queue/issues/new?assignees=&labels=&template=bug_report.md&title="
                            isExternal
                        >
                            Bug report
                        </Link>
                        <Link
                            href="https://github.com/CSSE1001/queue/issues/new?assignees=&labels=&template=feature_request.md&title="
                            isExternal
                        >
                            Feature request
                        </Link>
                    </HStack>
                </VStack>
            </Box>
        </>
    );
};
