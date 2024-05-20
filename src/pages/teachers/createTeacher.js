import Logo from "../../assets/images/plateaumed_logo.webp";
import "./createTeacher.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import { Eye } from "react-bootstrap-icons";
import { Dropdown } from "react-bootstrap";
import WhiteDropDown from "../../assets/images/dropdown-button.svg";
import toast from "react-hot-toast";
import FormGroup from "../../helpers/form-validation/FormGroup.js"
import {FormProvider,useForm} from "../../helpers/form-validation/FormContext";
import {validateField} from "../../helpers/form-validation/FormUtility";
import {TitleList} from "../../common/data/title-list";
import {createTeacher, getLoadedUserList} from "../../helpers/services/api";


const CreateTeacher =() => {
    return(
        <FormProvider>
            <CreateTeacherForm></CreateTeacherForm>
        </FormProvider>
    )
}

const CreateTeacherForm=(props)=> {
    const title = TitleList
    const { setFieldError, clearFieldError, errors } = useForm();
    const teacherObject = {
        national_no: "",
        title:'',
        firstname: "",
        lastname: "",
        dob:"",
        teacher_no: "",
        salary: 0,
        email: ''
    };
    const [formValues, setFormValues] = useState(teacherObject);
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
    const togglePassword = (id) => {
        var x = document.getElementById(id);
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    };


    const createUser = () => {
        let body = {
            id: getLoadedUserList().length,
            username: formValues.email,
            password: "password123",
            role: "TEACHER",
            profile: {
                national_no: formValues.national_no,
                title: formValues.title,
                firstname:formValues.firstname,
                lastname: formValues.lastname,
                dob: formValues.dob,
                teacher_no:formValues.teacher_no,
                salary: formValues.salary
            }
        }
        toast.promise(
            (createTeacher(body)),
            {
                loading: "Creating teacher",
                success: (res) => `Teacher created`,
                error: `Error creating teacher, Please try again or contact support`,
            }
        ).then(() => {
            localStorage.setItem("authUser",btoa(JSON.stringify(body)))
            navigate("/app/dashboard");
            window.location.reload()
        });
    };
    return (
        <div>

            <div id={'create-user'} className="create_group">
                <div className="title_wrap">
                    <div className="title1">Register as a Teacher</div>
                    <div className="title2">Please enter your registered credentials to access your account</div>
                </div>

                <div className="form_wrap form-wrap ">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="input_area">
                            <FormGroup label="Teacher No" fieldName="teacher_no" required validationType="required">
                                <input
                                    className="input_wrap"
                                    name="teacher_no"
                                    data-validation-type="required"
                                    value={formValues.teacher_no.toString()}
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

                            <Dropdown className="select-dropdown">
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    <FormGroup label="Title" fieldName="title" required validationType="required">
                                        <input
                                            className="input_wrap control select"
                                            name="title"
                                            data-validation-type="required"
                                            value={formValues.title.toString()}
                                            onChange={handleInputChange}
                                            type="text"
                                            readOnly
                                        />
                                    </FormGroup>
                                    <img className="arrow-down" src={WhiteDropDown} alt="dropdown" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {title.map((e,idx) => {
                                        return  <Dropdown.Item key={idx} onClick={() => setFormValues({ ...formValues, title: e })}>{e}</Dropdown.Item>
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
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
                            <FormGroup label="Date of Birth" fieldName="dob" required validationType="ageLessThan">
                                <input
                                    className="input_wrap"
                                    name="dob"
                                    data-validation-type="ageLessThan"
                                    value={formValues.dob.toString()}
                                    onChange={handleInputChange}
                                    placeholder="John"
                                    data-param={21}
                                    type="date"
                                />
                            </FormGroup>
                        </div>
                        <div className="input_area">
                            <FormGroup label="Salary" fieldName="salary" required validationType="numberOnly">
                                <input
                                    className="input_wrap"
                                    name="salary"
                                    data-validation-type="numberOnly"
                                    value={formValues.salary.toString()}
                                    onChange={handleInputChange}
                                    placeholder="1,200,000"
                                    type="text"
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

export default CreateTeacher;
