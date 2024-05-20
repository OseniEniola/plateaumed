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
export const validateAgeLessThan = (dob, ageLimit) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age > ageLimit;
};

export const validateAgeMoreThan = (dob, ageLimit) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age < ageLimit;
};

// Utils.js
export const validateField = (name, value,validationType, formValues, setFieldError, clearFieldError,param) => {
    clearFieldError(name);

    switch (validationType) {
        case 'required':
            if (!value) setFieldError(name, validationType);
            break;
        case 'email':
            if (!value) setFieldError(name,'required');
            else if (!validateEmail(value)) setFieldError(name,validationType);
            break;
        case 'username':
            if (!value) setFieldError(name, 'required');
            else if (containsSpecialCharacters(value)) setFieldError(name,validationType, 'specialCharacter');
            break;
        case 'password':
            if (!value) setFieldError(name, 'required');
            else if (!validateMinLength(value, 8)) setFieldError(name, 'minlength', { value: 8 });
            break;
        case 'confirmPassword':
            if (value && !matchPasswords(formValues.password, value)) setFieldError(name, 'confirmPassword');
            break;
        case 'phone':
            if (value && !isNumberOnly(value)) setFieldError(name, 'numberOnly');
            break;
        case 'numberOnly':
            if (value && !isNumberOnly(value)) setFieldError(name, 'numberOnly');
            break;
        case 'age':
            if (value && !validateMin(value, 18)) setFieldError(name, 'min', { value: 18 });
            if (value && !validateMax(value, 65)) setFieldError(name, 'max', { value: 65 });
            break;
        case 'exactLengthField':
            if (value && !validateExactLength(value, param || 5)) setFieldError(name, 'shouldBe', { value: param || 5 });
            break;
        case 'startChar':
            if (value && !startsWith(value, param ||'A')) setFieldError(name, 'startsWith', { value: param || 'A' });
            break;
        case 'minLengthField':
            if (value && !validateMinLength(value, param || 3)) setFieldError(name, 'minlength', { value:param || 3 });
            break;
        case 'maxLengthField':
            if (value && !validateMaxLength(value, param || 10)) setFieldError(name, 'maxlength', { value: param || 10 });
            break;
        case 'dateAfter':
            if (value && !validateDateAfter(value, param || '2022-01-01')) setFieldError(name, param || 'minDate');
            break;
        case 'dateBefore':
            if (value && !validateDateBefore(value,param ||  '2025-12-31')) setFieldError(name,param || 'maxDate');
            break;
        case 'ageLessThan':
            if (value && !validateAgeLessThan(value, param || 18)) setFieldError(name, 'ageLessThan', { value: param || 18 });
            break;
        case 'ageMoreThan':
            if (value && !validateAgeMoreThan(value, param || 18)) setFieldError(name, 'ageMoreThan', { value: param || 18 });
            break;
        default:
            break;
    }
};
