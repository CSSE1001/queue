import React, { useEffect, useState } from "react";
import { Button, Flex, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import { Container } from "../components/helpers/Container";
import {
    useMutationWithError,
    useQueryWithError,
} from "../hooks/useApolloHooksWithError";
import {
    GetCoursesQuery,
    useAddCourseMutation,
    useDeleteCourseMutation,
    useGetCoursesQuery,
} from "../generated/graphql";
import { Loadable } from "../components/helpers/Loadable";
import { CourseTable } from "../components/course-admin/CourseTable";
import { AddCourseModal } from "../components/course-admin/AddCourseModal";

type Props = {};

export const CourseAdminPageContainer: React.FC<Props> = () => {
    const { data: coursesData } = useQueryWithError(useGetCoursesQuery, {
        pollInterval: 10000,
    });
    const [
        deleteCourse,
        { data: deletedCourseData, loading: isDeletingCourse },
    ] = useMutationWithError(useDeleteCourseMutation, { errorPolicy: "all" });
    const [courses, setCourses] = useState<GetCoursesQuery["getCourses"]>([]);

    const [
        addCourse,
        { data: addedCourseData, loading: isAddingCourse },
    ] = useMutationWithError(useAddCourseMutation, { errorPolicy: "all" });

    const {
        isOpen: isAddCourseModalOpen,
        onClose: closeAddCourseModal,
        onOpen: openAddCourseModal,
    } = useDisclosure();

    useEffect(() => {
        if (!coursesData) {
            return;
        }
        setCourses(coursesData.getCourses);
    }, [coursesData]);

    useEffect(() => {
        if (!deletedCourseData) {
            return;
        }
        setCourses((prev) =>
            prev.filter(({ id }) => id !== deletedCourseData.deleteCourse)
        );
    }, [deletedCourseData]);

    useEffect(() => {
        if (!addedCourseData) {
            return;
        }
        setCourses((prev) => [...prev, addedCourseData.createCourse]);
    }, [addedCourseData]);

    return (
        <>
            <Container>
                <Text fontSize="3xl" mb={3}>
                    Courses
                </Text>
                <Flex>
                    <Spacer />
                    <Button colorScheme="green" onClick={openAddCourseModal}>
                        Add Course
                    </Button>
                </Flex>
                <Loadable isLoading={!coursesData || isDeletingCourse}>
                    <CourseTable
                        courses={courses}
                        deleteCourse={(courseId) => {
                            deleteCourse({ variables: { courseId } });
                        }}
                    />
                </Loadable>
            </Container>
            <AddCourseModal
                createCourse={async (courseInput) => {
                    await addCourse({ variables: { courseInput } });
                    closeAddCourseModal();
                }}
                isOpen={isAddCourseModalOpen}
                close={closeAddCourseModal}
                loading={isAddingCourse}
            />
        </>
    );
};
