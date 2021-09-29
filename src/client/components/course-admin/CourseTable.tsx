import React from "react";
import { IconButton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { BsX } from "react-icons/bs";
import { Icon } from "@chakra-ui/icons";
import { GetCoursesQuery } from "../../generated/graphql";

type Props = {
    courses: GetCoursesQuery["getCourses"];
    deleteCourse: (courseId: string) => void;
};

export const CourseTable: React.FC<Props> = ({ courses, deleteCourse }) => {
    return (
        <Table variant="striped">
            <Thead>
                <Tr>
                    <Th>Code</Th>
                    <Th>Title</Th>
                    <Th>Alias</Th>
                    <Th />
                </Tr>
            </Thead>
            <Tbody>
                {courses.map((course) => (
                    <Tr key={course.id}>
                        <Td>{course.code}</Td>
                        <Td> {course.title}</Td>
                        <Td>{course.alias || ""}</Td>
                        <Td isNumeric>
                            <IconButton
                                ml={2}
                                aria-label="remove-course"
                                colorScheme="red"
                                icon={<Icon boxSize="1.5em" as={BsX} />}
                                size="md"
                                onClick={() => {
                                    deleteCourse(course.id);
                                }}
                            />
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};
