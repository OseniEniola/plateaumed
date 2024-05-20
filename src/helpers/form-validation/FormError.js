// FormError.js
import React from 'react';
import { useForm } from './FormContext';

const errorMessages = {
    required: '##FIELD## is required *',
    minlength: '##FIELD## should be minimum ##VALUE## characters',
    maxlength: '##FIELD## should not be greater than ##VALUE## characters',
    pattern: 'Should be a valid ##FIELD##',
    email: 'Invalid email *',
    validEmail: 'Invalid email',
    specialCharacter: 'No Special Characters are allowed *',
    startsWith: '##FIELD## must start with ##VALUE##',
    numberOnly: 'Only Numbers are allowed *',
    letterOnly: 'Only Letters are allowed *',
    min: '##FIELD## minimum value is ##VALUE##',
    max: '##FIELD## maximum value is ##VALUE##',
    minDate: 'Date must be after the selected date',
    maxDate: 'Date must be before the selected date',
    shouldBe: '##FIELD## must be ##VALUE## characters',
    shouldBeEqual: 'Confirm password must match password',
    confirmPassword: 'Passwords must match *',
    alphaDash: 'Enter a valid name *',
    ageLessThan:'##FIELD## age is less than ##VALUE##',
    ageMoreThan:'##FIELD## age is more than ##VALUE##',

    customMessage: (params) => params.value,
};

const FormError = React.memo(({ validationType, fieldName, label }) => {
    const { errors } = useForm();
    if (!errors[fieldName]) {
        return null;
    }

    const getErrorMessage = (fieldName, errorType, params) => {
        let messageTemplate = errorMessages[errorType];
        if (typeof messageTemplate === 'function') {
            return messageTemplate(params);
        }
        return messageTemplate
            .replace('##FIELD##', label)
            .replace('##VALUE##', params?.value || '');
    };

    return (
        <div style={{ fontSize: '0.7rem' }} className="help-block errors text-danger animated shake">
            {getErrorMessage(errors[fieldName].fieldName, errors[fieldName].type, errors[fieldName].params)}
        </div>
    );
});
export default FormError;
