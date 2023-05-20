import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Container } from "../components/helpers/Container";
import { UserContext } from "../utils/user";
import { Map } from "immutable";
import {
    RoomInput,
    Room as GraphQLRoom,
    StaffRole,
    useAddRoomMutation,
    useDeleteRoomMutation,
    useUpdateRoomMutation,
    WeeklyEvent,
    useArchiveRoomMutation,
} from "../generated/graphql";
import { Form, Formik } from "formik";
import {
    Button,
    FormControl,
    FormLabel,
    Select,
    Stack,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { FormikInput } from "../components/helpers/FormikInput";
import { FormikNumberInput } from "../components/helpers/FormikNumberInput";
import { FormikCheckbox } from "../components/helpers/FormikCheckbox";
import { FormikActiveTimeInput } from "../components/helpers/FormikActiveTimeInput";
import { useMutationWithError } from "../hooks/useApolloHooksWithError";
import { CourseSelectContainer } from "./CourseSelectContainer";
import omit from "lodash/omit";
import { RoomDeleteAlert } from "../components/room/RoomDeleteAlert";

type Props = {};

const placeholderRoom: RoomInput = {
    name: "",
    capacity: 0,
    enforceCapacity: false,
    activeTimes: [],
};

type Room = Pick<
    GraphQLRoom,
    "id" | "name" | "capacity" | "enforceCapacity" | "archived"
> & {
    activeTimes: Pick<WeeklyEvent, "startTime" | "endTime" | "day">[];
};

export const RoomPageContainer: React.FC<Props> = () => {
    const user = useContext(UserContext)!;
    const [chosenRoomId, setChosenRoomId] = useState("");
    const [chosenCourse, setChosenCourse] = useState("");
    const [showing, setShowing] = useState<boolean>(false);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const {
        isOpen: isDeleteAlertOpen,
        onClose: closeDeleteAlert,
        onOpen: openDeleteAlert,
    } = useDisclosure();
    const [courses, setCourses] = useState<
        Map<string, { [key: string]: Room }>
    >(Map());
    const isCoordinator = useMemo(
        () =>
            user.getCourseStaff.some(
                (courseStaff) =>
                    courseStaff.role === StaffRole.Coordinator &&
                    courseStaff.course.id === chosenCourse
            ),
        [user.getCourseStaff, chosenCourse]
    );
    const toast = useToast();
    const [
        updateRoomMutation,
        { data: updateRoomMutationData, loading: updateRoomMutationLoading },
    ] = useMutationWithError(useUpdateRoomMutation, { errorPolicy: "all" });
    const [
        addRoomMutation,
        { data: addRoomMutationData, loading: addRoomMutationLoading },
    ] = useMutationWithError(useAddRoomMutation, { errorPolicy: "all" });
    const [
        deleteRoomMutation,
        { data: deleteRoomMutationData, loading: deleteRoomMutationLoading },
    ] = useMutationWithError(useDeleteRoomMutation, { errorPolicy: "all" });
    const [
        archiveRoomMutation,
        { data: archiveRoomMutationData, loading: archiveRoomMutationLoading },
    ] = useMutationWithError(useArchiveRoomMutation, { errorPolicy: "all" });
    useEffect(() => {
        document.title = "Manage Rooms";
    }, []);
    useEffect(() => {
        setShowing(false);
        setIsAdding(false);
        setChosenRoomId("");
    }, [chosenCourse]);
    const updateRoom = useCallback(
        (room: Room) => {
            setCourses((prev) =>
                prev.set(chosenCourse, {
                    ...prev.get(chosenCourse),
                    [room.id]: {
                        id: room.id,
                        name: room.name,
                        capacity: room.capacity,
                        enforceCapacity: room.enforceCapacity,
                        archived: room.archived,
                        activeTimes: room.activeTimes,
                    },
                })
            );
        },
        [chosenCourse]
    );
    useEffect(() => {
        if (!deleteRoomMutationData) {
            return;
        }
        setCourses((prev) =>
            prev.set(
                chosenCourse,
                omit(
                    prev.get(chosenCourse) || {},
                    deleteRoomMutationData.deleteRoom
                )
            )
        );
        toast({
            title: "Room deleted",
            status: "success",
        });
        setShowing(false);
        setIsAdding(false);
        setChosenRoomId("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteRoomMutationData, chosenCourse]);
    useEffect(() => {
        if (!updateRoomMutationData) {
            return;
        }
        const updatedRoom = updateRoomMutationData.updateRoom;
        updateRoom(updatedRoom);
    }, [updateRoomMutationData, updateRoom]);
    useEffect(() => {
        if (!archiveRoomMutationData) {
            return;
        }
        updateRoom(archiveRoomMutationData.archiveRoom);
    }, [archiveRoomMutationData, updateRoom]);
    useEffect(() => {
        if (!addRoomMutationData) {
            return;
        }
        const newRoom = addRoomMutationData.createRoom;
        updateRoom(newRoom);
        setIsAdding(false);
        setChosenRoomId("");
        setShowing(false);
        toast({
            title: "Room created",
            description: `Room '${newRoom.name}' is successfully created`,
            status: "success",
            isClosable: true,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addRoomMutationData]);
    useEffect(() => {
        user.getCourseStaff.forEach((courseStaff) => {
            setCourses((prev) =>
                prev.set(
                    courseStaff.course.id,
                    courseStaff.course.rooms.reduce<{
                        [key: string]: Room;
                    }>(
                        (prevValue, currentRoom) => ({
                            ...prevValue,
                            [currentRoom.id]: {
                                id: currentRoom.id,
                                name: currentRoom.name,
                                capacity: currentRoom.capacity,
                                enforceCapacity: currentRoom.enforceCapacity,
                                activeTimes: currentRoom.activeTimes,
                                archived: currentRoom.archived,
                            },
                        }),
                        {}
                    )
                )
            );
        });
    }, [user]);
    const chosenRoom = useMemo<Room | undefined>(() => {
        return courses.get(chosenCourse)?.[chosenRoomId];
    }, [courses, chosenCourse, chosenRoomId]);
    return (
        <>
            <Container>
                <CourseSelectContainer
                    selectCourse={setChosenCourse}
                    selectedCourse={chosenCourse}
                    allowedRoles={[StaffRole.Coordinator, StaffRole.Staff]}
                />
                {chosenCourse && (
                    <>
                        <FormControl mt={3}>
                            <FormLabel>Choose room:</FormLabel>
                            <Select
                                value={chosenRoomId}
                                onChange={(e) => {
                                    setChosenRoomId(e.target.value);
                                    setShowing(true);
                                    setIsAdding(false);
                                }}
                            >
                                <option disabled value="">
                                    Choose room
                                </option>
                                {Object.entries(
                                    courses.get(chosenCourse) || {}
                                ).map(([roomId, room]) => (
                                    <option key={roomId} value={roomId}>
                                        {room.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        <Text>or</Text>
                        <Button
                            colorScheme="green"
                            onClick={() => {
                                setIsAdding(true);
                                setShowing(true);
                                setChosenRoomId("");
                            }}
                        >
                            Add Room
                        </Button>
                    </>
                )}
                <Formik<RoomInput>
                    initialValues={placeholderRoom}
                    onSubmit={(values) => {
                        if (isAdding) {
                            addRoomMutation({
                                variables: {
                                    courseId: chosenCourse,
                                    roomInput: values,
                                },
                            });
                        } else {
                            updateRoomMutation({
                                variables: {
                                    roomId: chosenRoomId,
                                    roomInput: values,
                                },
                            });
                        }
                    }}
                    enableReinitialize={true}
                >
                    {showing && (
                        <Form>
                            <Stack spacing={3}>
                                <FormikInput name="name" />
                                <FormikNumberInput name="capacity" />
                                <FormikCheckbox
                                    label="Enforce Capacity:"
                                    name="enforceCapacity"
                                />
                                <FormikActiveTimeInput
                                    name="activeTimes"
                                    label="Weekly Active Times"
                                />
                                <Stack direction="row">
                                    <Button
                                        type="submit"
                                        colorScheme="blue"
                                        isLoading={
                                            updateRoomMutationLoading ||
                                            addRoomMutationLoading
                                        }
                                    >
                                        Save
                                    </Button>
                                    {!isAdding && (
                                        <Button
                                            isLoading={
                                                archiveRoomMutationLoading
                                            }
                                            colorScheme={
                                                chosenRoom?.archived === true
                                                    ? "green"
                                                    : "orange"
                                            }
                                            variant={
                                                chosenRoom?.archived === false
                                                    ? "solid"
                                                    : "outline"
                                            }
                                            onClick={() =>
                                                archiveRoomMutation({
                                                    variables: {
                                                        roomId: chosenRoomId,
                                                        archive: !chosenRoom!
                                                            .archived,
                                                    },
                                                })
                                            }
                                        >
                                            {chosenRoom?.archived
                                                ? "Restore"
                                                : "Archive"}
                                        </Button>
                                    )}
                                    {!isAdding && isCoordinator && (
                                        <Button
                                            colorScheme="red"
                                            isLoading={
                                                deleteRoomMutationLoading
                                            }
                                            onClick={openDeleteAlert}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </Stack>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Container>
            <RoomDeleteAlert
                isOpen={isDeleteAlertOpen}
                close={closeDeleteAlert}
                submit={() => {
                    deleteRoomMutation({
                        variables: {
                            roomId: chosenRoomId,
                        },
                    });
                }}
            />
        </>
    );
};
