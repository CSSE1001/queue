import React from "react";
import { QueueProps } from "./Queue";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { FormikInput } from "../helpers/FormikInput";
import { FormikCheckboxGroup } from "../helpers/FormikCheckboxGroup";
import { QueueAction, QueueTheme } from "../../generated/graphql";
import { FormikRadioGroup } from "../helpers/FormikRadioGroup";
import { FormikInputGroup } from "../helpers/FormikInputGroup";
import { FormikCheckbox } from "../helpers/FormikCheckbox";
import { QuestionSortTypeSelect } from "../../containers/QuestionSortTypeSelect";

type Props = Omit<QueueProps, "createdAt"> & {
    header: string;
    close: () => void;
    isOpen: boolean;
    onSubmit: (queue: Omit<QueueProps, "createdAt">) => void;
    onRemove?: (queueId: string) => void;
    editable: boolean;
};

export const QueueModal: React.FC<Props> = ({
    isOpen,
    close,
    id,
    onSubmit,
    name,
    actions,
    theme,
    shortDescription,
    sortType,
    examples,
    clearAfterMidnight,
    header,
    showEnrolledSession,
    onRemove,
    editable,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={close}
            size="xl"
            scrollBehavior="inside"
        >
            <ModalOverlay />
            <Formik
                initialValues={{
                    id,
                    name,
                    actions,
                    theme,
                    shortDescription,
                    sortType,
                    examples,
                    clearAfterMidnight,
                    showEnrolledSession,
                }}
                onSubmit={onSubmit}
            >
                <Form>
                    <ModalContent>
                        <ModalHeader>{header}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormikInput
                                name="name"
                                isReadOnly={!editable}
                                isDisabled={!editable}
                            />
                            <FormikCheckboxGroup
                                values={[
                                    QueueAction.Accept,
                                    QueueAction.Remove,
                                    QueueAction.Claim,
                                    QueueAction.Email,
                                    QueueAction.MarkNotNeeded,
                                ]}
                                name="actions"
                                direction="row"
                                isReadOnly={!editable}
                                isDisabled={!editable}
                                showCheckedOnly={!editable}
                            />
                            <FormikRadioGroup
                                name="theme"
                                values={[
                                    QueueTheme.Red,
                                    QueueTheme.Orange,
                                    QueueTheme.Yellow,
                                    QueueTheme.Green,
                                    QueueTheme.Cyan,
                                    QueueTheme.Teal,
                                    QueueTheme.Blue,
                                    QueueTheme.Purple,
                                    QueueTheme.Pink,
                                    QueueTheme.Gray,
                                ]}
                                stackDirection="column"
                                isReadOnly={!editable}
                                isDisabled={!editable}
                                showCheckedOnly={!editable}
                            />
                            <FormikInput
                                name="shortDescription"
                                isReadOnly={!editable}
                                isDisabled={!editable}
                            />
                            <QuestionSortTypeSelect editable={editable} />
                            <FormikInputGroup
                                name="examples"
                                label="Question Examples"
                                isReadOnly={!editable}
                                isDisabled={!editable}
                            />
                            <FormikCheckbox
                                name="clearAfterMidnight"
                                label="Clear after Midnight?"
                                isReadOnly={!editable}
                                isDisabled={!editable}
                            />
                            <FormikCheckbox
                                name="showEnrolledSession"
                                label="Show Student's Enrolled Session?"
                                isReadOnly={!editable}
                                isDisabled={!editable}
                            />
                        </ModalBody>

                        {editable && (
                            <ModalFooter>
                                <Button mr={3} variant="ghost" onClick={close}>
                                    Cancel
                                </Button>
                                <Button
                                    mr={3}
                                    colorScheme="blue"
                                    type="submit"
                                    onClick={close}
                                >
                                    Save
                                </Button>
                                {onRemove && (
                                    <Button
                                        colorScheme="red"
                                        onClick={() => {
                                            onRemove(id);
                                        }}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </ModalFooter>
                        )}
                    </ModalContent>
                </Form>
            </Formik>
        </Modal>
    );
};
