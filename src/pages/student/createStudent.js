import Logo from "../../assets/images/plateaumed_logo.webp";
import "./createStudent.scss";
import {Link, useNavigate} from "react-router-dom";
import React, {useCallback, useState} from "react";
import FormGroup from "../../helpers/form-validation/FormGroup.js"
import {FormProvider,useForm} from "../../helpers/form-validation/FormContext";
import {validateField} from "../../helpers/form-validation/FormUtility";
import {createStudent, getLoadedUserList} from "../../helpers/services/api";
import toast from "react-hot-toast";


const CreateStudent =() => {
    return(
        <FormProvider>
            <CreateStudentForm></CreateStudentForm>
        </FormProvider>
    )
}

const CreateStudentForm=(props)=> {
    const { setFieldError, clearFieldError, errors } = useForm();
    const studentObject = {
        national_no: "",
        firstname: "",
        lastname: "",
        dob:"",
        student_no: "",
        email: ''
    };
    const [formValues, setFormValues] = useState(studentObject);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const handleInputChange = useCallback((e) => {
        const { name, value, required, dataset } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
        validateField(name, value,dataset.validationType, formValues, setFieldError, clearFieldError,dataset.param);
    }, [formValues, setFieldError, clearFieldError]);

    const handleSubmit = (e) => {
        e.preventDefault();
        Object.keys(formValues).forEach((field) => {
            const fieldElement = e.target[field];
            validateField(
                field,
                formValues[field],
                fieldElement?.dataset.validationType,
                formValues,
                setFieldError,
                clearFieldError,
                fieldElement?.param
            );
        });

        if (Object.keys(errors).length === 0) {
            createUser()
            console.log('Form submitted successfully', formValues);
        } else {
            console.log('Form has errors');
        }
    };



    const createUser = () => {
        let body = {
            id: getLoadedUserList().length,
            username: formValues.email,
            password: "password",
            role: "STUDENT",
            profile: {
                national_no: formValues.national_no,
                firstname: formValues.firstname,
                lastname: formValues.lastname,
                dob: formValues.dob,
                student_no: formValues.student_no
            }
        }

        toast.promise(
            (createStudent(body)),
            {
                loading: "Creating student",
                success: (res) => `Student created`,
                error: `Error creating student, Please try again or contact support`,
            }
        ).then(() => {
            localStorage.setItem("authUser",btoa(JSON.stringify(body)))
            navigate("/app/students-list");
            window.location.reload()
        });;
    };
    return (
        <div>

            <div id={'create-user'} className="create_group">
                <div className="title_wrap">
                    <div className="title1">Register as a student</div>
                    <div className="title2">Please enter your registered credentials to access your account</div>
                </div>

                <div className="form_wrap form-wrap ">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="input_area">
                            <FormGroup label="Student No" fieldName="student_no" required validationType="required">
                                <input
                                    className="input_wrap"
                                    name="student_no"
                                    data-validation-type="required"
                                    value={formValues.student_no.toString()}
                                    onChange={handleInputChange}
                                    placeholder="123456"
                                    type="text"
                                />
                            </FormGroup>
                        </div>

                        <div className="input_area">
                            <FormGroup label="National No" fieldName="national_no" required validationType="required">
                                <input
                                    className="input_wrap"
                                    name="national_no"
                                    data-validation-type="required"
                                    value={formValues.national_no.toString()}
                                    onChange={handleInputChange}
                                    placeholder="123456"
                                    type="text"
                                />
                            </FormGroup>
                        </div>
                        <div className="input_area">
                            <FormGroup label="First Name" fieldName="firstname" required validationType="required">
                                <input
                                    className="input_wrap"
                                    name="firstname"
                                    data-validation-type="required"
                                    value={formValues.firstname.toString()}
                                    onChange={handleInputChange}
                                    placeholder="Frank"
                                    type="text"
                                />
                            </FormGroup>
                        </div>
                        <div className="input_area">
                            <FormGroup label="Last Name" fieldName="lastname" required validationType="required">
                                <input
                                    className="input_wrap"
                                    name="lastname"
                                    data-validation-type="required"
                                    value={formValues.lastname.toString()}
                                    onChange={handleInputChange}
                                    placeholder="John"
                                    type="text"
                                />
                            </FormGroup>
                        </div>

                        <div className="input_area">
                            <FormGroup label="Date of Birth" fieldName="dob" required validationType="ageMoreThan">
                                <input
                                    className="input_wrap"
                                    name="dob"
                                    data-validation-type="ageMoreThan"
                                    value={formValues.dob.toString()}
                                    onChange={handleInputChange}
                                    placeholder="John"
                                    data-param={22}
                                    type="date"
                                />
                            </FormGroup>
                        </div>

                        <div className="input_area">
                            <FormGroup label="Email" fieldName="email" required validationType="email">
                                <input
                                    className="input_wrap"
                                    name="email"
                                    data-validation-type="email"
                                    value={formValues.email.toString()}
                                    onChange={handleInputChange}
                                    placeholder="jon@mail.com"
                                    type="text"
                                />
                            </FormGroup>
                        </div>
                        <button className="submit">Create Account</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateStudent;
