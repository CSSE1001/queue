import React from "react";
import { FormikSelect } from "../components/helpers/FormikSelect";
import { QueueSortType } from "../generated/graphql";
import { useField } from "formik";
import { getSortTypeHelpText } from "../utils/queue";

type Props = {
    editable: boolean;
};

export const QuestionSortTypeSelect: React.FC<Props> = ({ editable }) => {
    const [, { value }] = useField<QueueSortType>("sortType");
    return (
        <FormikSelect
            name="sortType"
            options={[
                QueueSortType.Time,
                QueueSortType.Questions,
                QueueSortType.QuestionsAndTime,
            ]}
            isReadOnly={!editable}
            isDisabled={!editable}
            helpText={getSortTypeHelpText(value)}
        />
    );
};
