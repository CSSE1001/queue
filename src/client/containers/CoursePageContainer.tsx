import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useHistory, useParams } from "react-router-dom";
import { Container } from "../components/helpers/Container";
import {
    useLazyQueryWithError,
    useMutationWithError,
    useQueryWithError,
    useSubscriptionWithError,
} from "../hooks/useApolloHooksWithError";
import {
    QuestionStatus,
    QueueSortType,
    QueueTheme,
    UpdateQuestionStatusMutation,
    UpdateQueueMutation,
    useAskQuestionMutation,
    useCreateQueueMutation,
    useGetActiveRoomsQuery,
    useGetRoomByIdLazyQuery,
    useQuestionChangeSubscription,
    useRemoveQueueMutation,
    useUndoRemoveMutation,
    useUpdateQuestionStatusMutation,
    useUpdateQueueMutation,
} from "../generated/graphql";
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    Input,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { QuestionProps } from "./QuestionContainer";
import { RoomSelector } from "../components/queue/RoomSelector";
import { Map } from "immutable";
import { Queue, QueueProps } from "../components/queue/Queue";
import parseISO from "date-fns/parseISO";
import { ClaimModal } from "../components/queue/ClaimModal";
import omit from "lodash/omit";
import { UserContext } from "../utils/user";
import { QueueModal } from "../components/queue/QueueModal";
import { pushNotification, QueueContext } from "../utils/queue";
import sortBy from "lodash/sortBy";
import { redacted } from "../../constants";
import { NoQueueAlert } from "../components/queue/NoQueueAlert";

type Props = {};

type CourseParam = {
    courseCode: string;
};

const placeholderQueue: QueueProps = {
    id: "",
    name: "",
    theme: QueueTheme.Red,
    shortDescription: "",
    examples: [],
    actions: [],
    sortType: QueueSortType.QuestionsAndTime,
    clearAfterMidnight: true,
    showEnrolledSession: false,
    createdAt: new Date(),
};

export const CoursePageContainer: React.FC<Props> = () => {
    const {
        isOpen: isClaimModalOpen,
        onOpen: openClaimModal,
        onClose: closeClaimModal,
    } = useDisclosure();
    const {
        isOpen: isQueueModalOpen,
        onOpen: openQueueModal,
        onClose: closeQueueModal,
    } = useDisclosure();
    const [queues, setQueues] = useState<Map<string, QueueProps>>(Map());
    const [addingNewQueue, setAddingNewQueue] = useState(false);
    const [chosenQueueId, setChosenQueueId] = useState("");
    const [chosenRoomId, setChosenRoomId] = useState("default");
    const [displayedQueues, setDisplayedQueues] = useState<string[]>([]);
    const [sessionFilter, setSessionFilter] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const { courseCode } = useParams<CourseParam>();
    const history = useHistory();
    const [queueQuestions, setQueueQuestions] = useState<
        Map<string, { [key: string]: QuestionProps }>
    >(Map());
    const toast = useToast();
    const {
        data: activeRoomsData,
        error: activeRoomsError,
        loading: activeRoomsLoading,
    } = useQueryWithError(useGetActiveRoomsQuery, {
        variables: {
            courseCode,
        },
        errorPolicy: "all",
        fetchPolicy: "cache-and-network",
        pollInterval: 30000,
    });
    const [
        getRoomById,
        { data: roomData, loading: getRoomLoading },
    ] = useLazyQueryWithError(useGetRoomByIdLazyQuery, {
        errorPolicy: "all",
        pollInterval: 30000,
        fetchPolicy: "cache-and-network",
    });
    const [
        updateQueue,
        { data: updateQueueData },
    ] = useMutationWithError(useUpdateQueueMutation, { errorPolicy: "all" });
    const { data: questionChangeData } = useSubscriptionWithError(
        useQuestionChangeSubscription,
        {
            variables: {
                roomId: roomData?.getRoomById.id || "",
            },
        }
    );
    const [
        askQuestionMutation,
        { data: askQuestionData },
    ] = useMutationWithError(useAskQuestionMutation, { errorPolicy: "all" });
    const [
        updateQuestionMutation,
        { data: updateQuestionData },
    ] = useMutationWithError(useUpdateQuestionStatusMutation, {
        errorPolicy: "all",
    });
    const [
        createQueueMutation,
        { data: createQueueData },
    ] = useMutationWithError(useCreateQueueMutation, {
        errorPolicy: "all",
    });
    const [
        removeQueueMutation,
        { data: removeQueueData },
    ] = useMutationWithError(useRemoveQueueMutation, { errorPolicy: "all" });
    const [
        undoRemoveMutation,
        { data: undoRemoveData },
    ] = useMutationWithError(useUndoRemoveMutation, { errorPolicy: "all" });
    useEffect(() => {
        if (!activeRoomsError) {
            return;
        }
        history.push("/");
    }, [activeRoomsError, history]);
    const askQuestion = useCallback(
        (queueId: string) => {
            askQuestionMutation({
                variables: { queueId },
            });
        },
        [askQuestionMutation]
    );
    const viewQueueInfo = useCallback(
        (queueId: string) => {
            setChosenQueueId(queueId);
            setAddingNewQueue(false);
            openQueueModal();
        },
        [openQueueModal]
    );
    const user = useContext(UserContext)!;
    const updateQueues = useCallback(
        (queue: UpdateQueueMutation["updateQueue"]) => {
            setQueues((prev) =>
                prev.set(queue.id, {
                    id: queue.id,
                    name: queue.name,
                    theme: queue.theme,
                    shortDescription: queue.shortDescription,
                    actions: queue.actions,
                    sortType: queue.sortedBy,
                    examples: queue.examples,
                    clearAfterMidnight: queue.clearAfterMidnight,
                    showEnrolledSession: queue.showEnrolledSession,
                    createdAt: parseISO(queue.createdAt),
                })
            );
        },
        []
    );
    const isStaff = useMemo(() => {
        if (!user) {
            return false;
        }
        if (user.isAdmin) {
            return true;
        }
        return user.getCourseStaff.some(
            (courseStaff) => courseStaff.course.code === courseCode
        );
    }, [user, courseCode]);

    const updateQueueQuestion = useCallback(
        (question: UpdateQuestionStatusMutation["updateQuestionStatus"]) => {
            if (
                [QuestionStatus.Closed, QuestionStatus.Accepted].includes(
                    question.status
                )
            ) {
                setQueueQuestions((prev) =>
                    prev.set(
                        question.queue.id,
                        omit(prev.get(question.queue.id) || {}, question.id)
                    )
                );
                return;
            }
            setQueueQuestions((prev) =>
                prev.set(question.queue.id, {
                    ...(prev.get(question.queue.id) || {}),
                    [question.id]: {
                        id: question.id,
                        askerName: question.op.name,
                        askerUsername: question.op.username,
                        askerEmail:
                            question.op.email === redacted
                                ? `${question.op.username}@student.uq.edu.au`
                                : question.op.email,
                        askedTime: parseISO(question.createdTime),
                        questionCount: question.questionsAsked,
                        status: question.status,
                        claimer: question.claimer,
                        enrolledSession: question.enrolledIn,
                    },
                })
            );
        },
        []
    );

    useEffect(() => {
        if (!roomData) {
            return;
        }
        roomData.getRoomById.queues.forEach((queue) => {
            setQueueQuestions((prev) =>
                prev.set(
                    queue.id,
                    queue.activeQuestions.reduce<{
                        [key: string]: QuestionProps;
                    }>(
                        (prevValue, question) => ({
                            ...prevValue,
                            [question.id]: {
                                id: question.id,
                                askerName: question.op.name,
                                askerUsername: question.op.username,
                                askedTime: parseISO(question.createdTime),
                                questionCount: question.questionsAsked,
                                status: question.status,
                                askerEmail:
                                    question.op.email === redacted
                                        ? `${question.op.username}@student.uq.edu.au`
                                        : question.op.email,
                                enrolledSession: question.enrolledIn,
                                claimer: question.claimer,
                            },
                        }),
                        {}
                    )
                )
            );
            updateQueues(queue);
        });
        setDisplayedQueues(
            roomData.getRoomById.queues.map((queue) => queue.id)
        );
    }, [roomData, courseCode, updateQueues]);

    useEffect(() => {
        if (!questionChangeData) {
            return;
        }
        const updatedQuestion = questionChangeData.questionChanges;
        updateQueueQuestion(updatedQuestion);
        if (
            updatedQuestion.op.username === user.username &&
            updatedQuestion.status === QuestionStatus.Claimed
        ) {
            pushNotification(
                "Question Claimed",
                updatedQuestion.claimMessage || "Your question has been claimed"
            );
            toast({
                title: "Question Claimed",
                description: updatedQuestion.claimMessage,
                status: "success",
                duration: null,
                isClosable: true,
            });
        }
    }, [questionChangeData, updateQueueQuestion, user.username, toast]);

    useEffect(() => {
        document.title = `${courseCode}`;
    }, [courseCode]);

    useEffect(() => {
        if (!askQuestionData) {
            return;
        }
        const question = askQuestionData.askQuestion;
        updateQueueQuestion(question);
    }, [askQuestionData, updateQueueQuestion]);
    useEffect(() => {
        if (!undoRemoveData) {
            return;
        }
        const question = undoRemoveData.undoRemove;
        updateQueueQuestion(question);
    }, [undoRemoveData, updateQueueQuestion]);
    useEffect(() => {
        if (!removeQueueData) {
            return;
        }
        const removedId = removeQueueData.removeQueue;
        setDisplayedQueues((prev) =>
            prev.filter((queueId) => queueId !== removedId)
        );
        setQueues((prev) => prev.remove(removedId));
    }, [removeQueueData]);

    const updateQuestionStatus = useCallback(
        (
            questionId: string,
            questionStatus: QuestionStatus,
            message?: string
        ) => {
            updateQuestionMutation({
                variables: {
                    questionStatus,
                    questionId,
                    message,
                },
            });
        },
        [updateQuestionMutation]
    );
    useEffect(() => {
        if (!updateQuestionData) {
            return;
        }
        const updatedQuestion = updateQuestionData.updateQuestionStatus;
        updateQueueQuestion(updatedQuestion);
    }, [updateQuestionData, updateQueueQuestion]);
    useEffect(() => {
        if (!createQueueData) {
            return;
        }
        const newQueue = createQueueData.createQueue;
        updateQueues(newQueue);
        setDisplayedQueues((prev) => [...prev, newQueue.id]);
    }, [createQueueData, updateQueues]);

    useEffect(() => {
        if (!updateQueueData) {
            return;
        }
        const updatedQueue = updateQueueData.updateQueue;
        updateQueues(updatedQueue);
    }, [updateQueueData, updateQueues]);
    useEffect(() => {
        if (!activeRoomsData) {
            return;
        }
        if (
            chosenRoomId !== "default" &&
            !activeRoomsData.getActiveRooms
                .map((room) => room.id)
                .includes(chosenRoomId)
        ) {
            toast({
                status: "info",
                title: "Room closed",
                description:
                    "This room was just closed and you cannot join the queue anymore",
                duration: null,
                isClosable: true,
            });
            setChosenRoomId("default");
            setDisplayedQueues([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeRoomsData, chosenRoomId]);
    return (
        <QueueContext.Provider
            value={{
                updateQuestionStatus,
                setSelectedQuestion,
                openClaimModal,
                courseCode,
            }}
        >
            <Container>
                <Text fontSize="3xl" mb={3}>
                    {courseCode}
                </Text>
                <Flex justifyContent="space-between">
                    <RoomSelector
                        selected={chosenRoomId}
                        onSelect={(roomId) => {
                            getRoomById({
                                variables: {
                                    roomId,
                                },
                            });
                            setChosenRoomId(roomId);
                        }}
                        isStaff={isStaff}
                        rooms={sortBy(
                            activeRoomsData?.getActiveRooms.map((room) => [
                                room.id,
                                room.name,
                                room.isActive,
                                room.archived,
                            ]) || [],
                            ([, name, isActive]) => [!isActive, name]
                        )}
                    />
                    {isStaff && chosenRoomId !== "default" && (
                        <Button
                            onClick={() => {
                                setAddingNewQueue(true);
                                openQueueModal();
                            }}
                            colorScheme="green"
                            ml="auto"
                            mt={3}
                        >
                            Add new queue
                        </Button>
                    )}
                </Flex>
                {isStaff && chosenRoomId !== "default" && (
                    <FormControl
                        d="flex"
                        flexDirection="row"
                        alignItems="center"
                        mt={5}
                    >
                        <FormLabel>Session Filter:</FormLabel>
                        <Input
                            value={sessionFilter}
                            onChange={(e) => setSessionFilter(e.target.value)}
                            placeholder="P01"
                            w="25vw"
                        />
                    </FormControl>
                )}
                {displayedQueues.length === 0 &&
                    chosenRoomId !== "default" &&
                    !activeRoomsLoading &&
                    !getRoomLoading && <NoQueueAlert isStaff={isStaff} />}
                <Grid
                    mt={6}
                    templateColumns="repeat(auto-fit, minmax(500px, 1fr))"
                    gap={10}
                >
                    {sortBy(displayedQueues, (queueId) => {
                        return queues.get(queueId)?.createdAt || new Date();
                    }).map((queueId, index) => (
                        <Queue
                            key={queueId}
                            {...(queues.get(queueId) || placeholderQueue)}
                            questions={Object.values(
                                queueQuestions.get(queueId) || {}
                            )}
                            sessionFilter={sessionFilter}
                            askQuestion={askQuestion}
                            isStaff={isStaff}
                            openQueueInfoModal={viewQueueInfo}
                            onUndo={(queueId) => {
                                undoRemoveMutation({ variables: { queueId } });
                            }}
                            index={index + 1}
                            queuesNum={displayedQueues.length}
                        />
                    ))}
                </Grid>
            </Container>
            <ClaimModal
                isOpen={isClaimModalOpen}
                close={closeClaimModal}
                questionId={selectedQuestion}
            />
            <QueueModal
                editable={isStaff}
                {...(addingNewQueue
                    ? placeholderQueue
                    : queues.get(chosenQueueId) || placeholderQueue)}
                close={closeQueueModal}
                onSubmit={({
                    id,
                    name,
                    shortDescription,
                    actions,
                    sortType,
                    examples,
                    clearAfterMidnight,
                    theme,
                    showEnrolledSession,
                }) => {
                    if (addingNewQueue) {
                        createQueueMutation({
                            variables: {
                                roomId: chosenRoomId,
                                queueInput: {
                                    name,
                                    shortDescription,
                                    examples,
                                    theme,
                                    sortedBy: sortType,
                                    clearAfterMidnight,
                                    actions,
                                    showEnrolledSession,
                                },
                            },
                        });
                        setAddingNewQueue(false);
                    } else {
                        updateQueue({
                            variables: {
                                queueId: id,
                                queueInput: {
                                    name,
                                    shortDescription,
                                    actions,
                                    examples,
                                    clearAfterMidnight,
                                    sortedBy: sortType,
                                    theme,
                                    showEnrolledSession,
                                },
                            },
                        });
                    }
                }}
                isOpen={isQueueModalOpen}
                header={
                    isStaff
                        ? addingNewQueue
                            ? "Add a new Queue"
                            : "Edit Queue"
                        : "View Queue"
                }
                onRemove={
                    addingNewQueue
                        ? undefined
                        : async (queueId) => {
                              await removeQueueMutation({
                                  variables: {
                                      queueId,
                                  },
                              });
                              closeQueueModal();
                          }
                }
            />
        </QueueContext.Provider>
    );
};
