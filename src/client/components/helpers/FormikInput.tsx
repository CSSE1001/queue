import React from "react";
import { Field, FieldInputProps, FieldProps } from "formik";
import {
    Box,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    InputProps,
} from "@chakra-ui/react";
import { camelCase, capitalCase } from "change-case";

type Props = {
    name: string;
    id?: string;
    label?: string;
    type?: string;
    helperText?: string;
} & Omit<InputProps, keyof FieldInputProps<any> | "type">;

export const FormikInput: React.FC<Props> = ({
    name,
    id,
    label,
    type = "text",
    helperText,
    ...props
}) => {
    return (
        <Field name={name}>
            {({ field, form, meta }: FieldProps) => (
                <FormControl
                    id={id || camelCase(name)}
                    isInvalid={!!form.errors[name] && !!form.touched[name]}
                    mt={3}
                >
                    <FormLabel>
                        {label || capitalCase(name)}
                        {props.isRequired && (
                            <Box color="red" as="span">
                                *
                            </Box>
                        )}
                    </FormLabel>
                    <Input {...props} {...field} type={type} />
                    {meta.touched && meta.error && (
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                    )}
                    {helperText && (
                        <FormHelperText>{helperText}</FormHelperText>
                    )}
                </FormControl>
            )}
        </Field>
    );
};
