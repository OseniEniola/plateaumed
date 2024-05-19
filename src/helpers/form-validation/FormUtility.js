// Utils.js
export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const containsSpecialCharacters = (str) => /[^a-zA-Z0-9]/.test(str);
export const startsWith = (str, char) => str.startsWith(char);
export const isNumberOnly = (str) => /^\d+$/.test(str);
export const isLetterOnly = (str) => /^[a-zA-Z]+$/.test(str);
export const validateMinLength = (str, length) => str.length >= length;
export const validateMaxLength = (str, length) => str.length <= length;
export const validateMin = (num, min) => num >= min;
export const validateMax = (num, max) => num <= max;
export const validateDateAfter = (date, minDate) => new Date(date) > new Date(minDate);
export const validateDateBefore = (date, maxDate) => new Date(date) < new Date(maxDate);
export const validateExactLength = (str, length) => str.length === length;
export const matchPasswords = (password, confirmPassword) => password === confirmPassword;


// Utils.js
export const validateField = (name, value, formValues, setFieldError, clearFieldError) => {
    clearFieldError(name);

    switch (name) {
        case 'email':
            if (!value) setFieldError(name, 'required');
            else if (!validateEmail(value)) setFieldError(name, 'email');
            break;
        case 'username':
            if (!value) setFieldError(name, 'required');
            else if (containsSpecialCharacters(value)) setFieldError(name, 'specialCharacter');
            break;
        case 'password':
            if (!value) setFieldError(name, 'required');
            else if (!validateMinLength(value, 8)) setFieldError(name, 'minlength', { value: 8 });
            break;
        case 'confirmPassword':
            if (!matchPasswords(formValues.password, value)) setFieldError(name, 'confirmPassword');
            break;
        case 'phone':
            if (!isNumberOnly(value)) setFieldError(name, 'numberOnly');
            break;
        case 'age':
            if (!validateMin(value, 18)) setFieldError(name, 'min', { value: 18 });
            if (!validateMax(value, 65)) setFieldError(name, 'max', { value: 65 });
            break;
        case 'exactLengthField':
            if (!validateExactLength(value, 5)) setFieldError(name, 'shouldBe', { value: 5 });
            break;
        case 'startChar':
            if (!startsWith(value, 'A')) setFieldError(name, 'startsWith', { value: 'A' });
            break;
        case 'minLengthField':
            if (!validateMinLength(value, 3)) setFieldError(name, 'minlength', { value: 3 });
            break;
        case 'maxLengthField':
            if (!validateMaxLength(value, 10)) setFieldError(name, 'maxlength', { value: 10 });
            break;
        case 'dateAfter':
            if (!validateDateAfter(value, '2022-01-01')) setFieldError(name, 'minDate');
            break;
        case 'dateBefore':
            if (!validateDateBefore(value, '2025-12-31')) setFieldError(name, 'maxDate');
            break;
        default:
            break;
    }
};
