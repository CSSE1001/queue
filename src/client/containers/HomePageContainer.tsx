import { SearchIcon } from "@chakra-ui/icons";
import {
    Box,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    Stack,
    Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../utils/user";
import { courseRequestMailto } from "../utils/course-request";
import { NAVBAR_REAL_HEIGHT } from "../constants";

type Props = {};

export const HomePageContainer: React.FC<Props> = () => {
    const history = useHistory();
    const [course, setCourse] = useState("");
    useEffect(() => {
        document.title = "Q";
    }, []);
    const { name, username } = useContext(UserContext)!;
    return (
        <Box h={`calc(100vh - ${NAVBAR_REAL_HEIGHT}px)`}>
            <Stack h="100%" justifyContent="center" alignItems="center">
                <Text fontSize="10em" fontFamily="'Courier New', monospace">
                    Q
                </Text>
                <InputGroup w="max(30vw, 200px)" size="lg">
                    <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input
                        placeholder="Enter your course code here:"
                        value={course}
                        onChange={(e) => {
                            setCourse(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                history.push(`/${course.toUpperCase()}`);
                            }
                        }}
                        autoFocus
                        _placeholder={{
                            color: "#555",
                        }}
                    />
                </InputGroup>
                {username.startsWith("uq") && (
                    <Text pt={6}>
                        Want to use the queue in your course?{" "}
                        <Link
                            onClick={(e) => {
                                e.preventDefault();
                                document.location.href = courseRequestMailto(
                                    name
                                );
                            }}
                            color="teal"
                        >
                            Request Queue Access
                        </Link>
                    </Text>
                )}
            </Stack>
        </Box>
    );
};
