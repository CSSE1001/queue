import {
    FormControl,
    FormLabel,
    Radio,
    RadioProps,
    Stack,
} from "@chakra-ui/react";
import { capitalCase } from "change-case";
import { useField } from "formik";
import React from "react";

type Props = RadioProps & {
    name: string;
    values: string[];
    label?: string;
    formatValue?: (value: string) => string;
    stackDirection?: "row" | "column";
    showCheckedOnly?: boolean;
};

export const FormikRadioGroup: React.FC<Props> = ({
    name,
    values,
    label,
    formatValue,
    stackDirection = "row",
    showCheckedOnly = false,
    ...radioProps
}) => {
    const [, { value }, { setValue }] = useField(name);

    return (
        <FormControl mt={3}>
            <FormLabel>{label || capitalCase(name)}</FormLabel>
            <Stack direction={stackDirection} spacing={2}>
                {values
                    .filter(
                        (radioValue) => !showCheckedOnly || radioValue === value
                    )
                    .map((radioValue, key) => (
                        <Radio
                            onChange={(e) => {
                                setValue(e.target.value);
                            }}
                            value={radioValue}
                            isChecked={value === radioValue}
                            key={key}
                            id={`formik-radio-${name}-${key}`}
                            {...radioProps}
                        >
                            {formatValue?.(radioValue) ||
                                capitalCase(radioValue)}
                        </Radio>
                    ))}
            </Stack>
        </FormControl>
    );
};
