import React from "react";
import {
    Checkbox,
    CheckboxProps,
    FormControl,
    FormLabel,
} from "@chakra-ui/react";
import { useField } from "formik";

type Props = CheckboxProps & {
    name: string;
    label: string;
    displayedValues?: [string, string];
};

export const FormikCheckbox: React.FC<Props> = ({
    name,
    label,
    displayedValues,
    ...checkboxProps
}) => {
    const [, { value }, { setValue }] = useField<boolean>(name);
    return (
        <FormControl mt={3}>
            <FormLabel>{label}</FormLabel>
            <Checkbox
                isChecked={value}
                onChange={(e) => setValue(e.target.checked)}
                {...checkboxProps}
            >
                {(displayedValues || ["No", "Yes"])[+value]}
            </Checkbox>
        </FormControl>
    );
};
