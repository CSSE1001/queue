import React, { FC } from "react";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
} from "@chakra-ui/react";

type Props = {
    isStaff: boolean;
};

export const NoQueueAlert: FC<Props> = ({ isStaff }) => {
    return (
        <Alert
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            mt={10}
            w="80%"
            mx="auto"
            borderRadius={5}
        >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
                No queues found!
            </AlertTitle>
            <AlertDescription maxWidth="sm">
                It seems like this room doesn't have a queue yet. <br />
                {isStaff ? (
                    <>
                        Click on the <strong>Add new queue</strong> button to
                        create your first queue.
                    </>
                ) : (
                    "Please contact the course staff if you think this is unexpected."
                )}
            </AlertDescription>
        </Alert>
    );
};
