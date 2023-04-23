import React from "react";
import { Flex, FormLabel, Select } from "@chakra-ui/react";

type Props = {
    isStaff: boolean;
    selected: string;
    onSelect: (roomId: string) => void;
    rooms: [
        roomId: string,
        roomName: string,
        isActive: boolean,
        archived: boolean
    ][];
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
                {rooms.map(([roomId, roomName, isActive, archived]) => (
                    <option key={roomId} value={roomId}>
                        {(!isStaff || (isActive && !archived)) && `${roomName}`}
                        {isStaff && archived && `${roomName} (archived)`}
                        {isStaff &&
                            !archived &&
                            !isActive &&
                            `${roomName} (inactive)`}
                    </option>
                ))}
            </Select>
        </Flex>
    );
};
