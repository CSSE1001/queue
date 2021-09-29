import React from "react";
import { CourseInput } from "../../generated/graphql";
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

type Props = {
    createCourse: (courseInput: CourseInput) => void;
    isOpen: boolean;
    close: () => void;
    loading: boolean;
};

export const AddCourseModal: React.FC<Props> = ({
    createCourse,
    isOpen,
    close,
    loading,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={close} size="lg" isCentered>
            <ModalOverlay />
            <ModalContent>
                <Formik<CourseInput>
                    initialValues={{
                        code: "",
                        title: "",
                        alias: "",
                    }}
                    onSubmit={(values) => {
                        createCourse({
                            code: values.code,
                            title: values.title,
                            alias: values.alias || undefined,
                        });
                    }}
                >
                    <Form>
                        <ModalHeader>Add Course</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormikInput
                                name="code"
                                isRequired
                                placeholder="e.g. CSSE1001"
                            />
                            <FormikInput
                                name="title"
                                isRequired
                                placeholder="e.g. Introduction to Software Engineering"
                            />
                            <FormikInput
                                name="alias"
                                placeholder="e.g. CSSE7030"
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button onClick={close}>Cancel</Button>
                            <Button
                                colorScheme="blue"
                                ml={3}
                                type="submit"
                                isLoading={loading}
                            >
                                Add
                            </Button>
                        </ModalFooter>
                    </Form>
                </Formik>
            </ModalContent>
        </Modal>
    );
};
