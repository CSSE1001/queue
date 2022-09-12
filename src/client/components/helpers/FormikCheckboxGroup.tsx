import {
    Checkbox,
    CheckboxProps,
    FormControl,
    FormLabel,
    Stack,
    StackProps,
} from "@chakra-ui/react";
import React from "react";
import { useField } from "formik";
import { capitalCase } from "change-case";

type Props<T extends number | string> = CheckboxProps & {
    values: T[];
    name: string;
    transformValue?: (value: T) => string;
    direction?: StackProps["direction"];
    showCheckedOnly?: boolean;
};

export const FormikCheckboxGroup = <T extends number | string>({
    values,
    name,
    transformValue,
    direction,
    showCheckedOnly = false,
    ...checkboxProps
}: Props<T>) => {
    const [
        ,
        { value: checkedValues },
        { setValue: setCheckedValues },
    ] = useField<T[]>(name);
    return (
        <FormControl mt={3}>
            <FormLabel>{capitalCase(name)}</FormLabel>
            <Stack spacing={2} direction={direction}>
                {values
                    .filter(
                        (value) =>
                            !showCheckedOnly || checkedValues.includes(value)
                    )
                    .map((value, key) => (
                        <Checkbox
                            value={value}
                            key={key}
                            isChecked={checkedValues.includes(value)}
                            onChange={(e) => {
                                e.target.checked
                                    ? setCheckedValues([
                                          ...checkedValues,
                                          value,
                                      ])
                                    : setCheckedValues(
                                          checkedValues.filter(
                                              (checkedValue) =>
                                                  checkedValue !== value
                                          )
                                      );
                            }}
                            {...checkboxProps}
                        >
                            {transformValue?.(value) ||
                                capitalCase(String(value))}
                        </Checkbox>
                    ))}
            </Stack>
        </FormControl>
    );
};
