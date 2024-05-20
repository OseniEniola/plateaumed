import React from 'react';
import FormError from './FormError';

const FormGroup = React.memo(({ label, fieldName, required, validationType, children }) => {
    return (
        <div className="form-group">
            <label className="case_label_cls">
                {label}
                {required && <sub className="ml-1 text-danger font-size-sm font-weight-bold">*</sub>}
            </label>
            {children}
            <FormError validationType={validationType} fieldName={fieldName} label={label} />
        </div>
    );
});

export default FormGroup;
