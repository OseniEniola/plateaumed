import React, { createContext, useContext, useState, useCallback } from 'react';

const FormContext = createContext();

export const useForm = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
    const [errors, setErrors] = useState({});

    const setFieldError = useCallback((fieldName, errorType, params = {}) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: {fieldName, type: errorType, params },
        }));
    }, []);

    const clearFieldError = useCallback((fieldName) => {
        setErrors((prevErrors) => {
            const { [fieldName]: _, ...rest } = prevErrors;
            return rest;
        });
    }, []);

    return (
        <FormContext.Provider value={{ errors, setFieldError, clearFieldError }}>
            {children}
        </FormContext.Provider>
    );
};
