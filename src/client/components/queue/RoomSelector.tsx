import React from "react";
import { Flex, FormLabel, Select } from "@chakra-ui/react";

type Props = {
    isStaff: boolean;
    selected: string;
    onSelect: (roomId: string) => void;
    rooms: [roomId: string, roomName: string, isActive: boolean][];
};

export const RoomSelector: React.FC<Props> = ({
    isStaff,
    onSelect,
    rooms,
    selected,
}) => {
    return (
        <Flex alignItems="center">
            <FormLabel>Choose room:</FormLabel>
            <Select
                onChange={(e) => {
                    onSelect(e.target.value);
                }}
                w="25vw"
                value={selected}
            >
                <option value="default" disabled>
                    Choose an option
                </option>
                {rooms.map(([roomId, roomName, isActive]) => (
                    <option key={roomId} value={roomId}>
                        {(!isStaff || !isActive) && `${roomName}`}
                        {isStaff && isActive && `${roomName} (active)`}
                    </option>
                ))}
            </Select>
        </Flex>
    );
};
