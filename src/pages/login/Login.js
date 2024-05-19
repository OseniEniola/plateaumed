import React, {useCallback, useEffect, useState} from "react";
import { Eye } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/plateaumed_logo.webp";
import "./login.scss";
import {LoginData} from "../../common/dto/login.dto";
import FormGroup from "../../helpers/form-validation/FormGroup.js"

//Import FormValidation
const FormContextModule = await import("../../helpers/form-validation/FormContext.js");
const { FormProvider, useForm } = FormContextModule as any;
const FormValidationUtility = await import("../../helpers/form-validation/FormUtility.js");
const { validateField } = FormValidationUtility as any;


function Login() {
  const { setFieldError, clearFieldError, errors } = (useForm() as any);
  const userObject: LoginData =  {} as LoginData;
  const [formValues, setFormValues] = useState(userObject);
  


  const handleInputChange = useCallback((e:any) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    validateField(name, value, formValues, setFieldError, clearFieldError);
  }, [formValues, setFieldError, clearFieldError]);

  const handleSubmit = (e:any) => {
    e.preventDefault();
    Object.keys(formValues).forEach((field) => {
          validateField(field, formValues[field as keyof LoginData], formValues, setFieldError, clearFieldError);
        }
    );
    if (Object.keys(errors).length === 0) {
      console.log('Form submitted successfully', formValues);
    } else {
      console.log('Form has errors');
    }
  };



  const togglePassword = () => {
    var x = document.getElementById("password") as any;
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };


  return (
    <div>
      <div className="logo home">
        <img src={Logo} alt="Nigenius" title="Nigenius" />
      </div>

      <div className="create_group">
        <div className="title_wrap">
          <div className="title1">Login into Nigenius</div>
          <div className="title2">
            Please enter your registered credentials to access your account
          </div>
         
        </div>

        <div className="form_wrap">
          <FormProvider>
            <form onSubmit={handleSubmit}>
              <div className="input_area">
                <FormGroup label="Email" fieldName="email" required>
                  <input
                      className="form-control"
                      name="email"
                      value={formValues.email.toString()}
                      onChange={handleInputChange}
                      placeholder="samuelo@gmail.com"
                      type="text"
                  />
                </FormGroup>
              </div>
              <div className="input_area">
                <FormGroup label="Email" fieldName="email" required>
                  <input
                      className="form-control"
                      name="password"
                      value={formValues.password.toString()}
                      onChange={handleInputChange}
                      placeholder="samuelo@gmail.com"
                      type="password"
                  />
                </FormGroup>
                <Eye onClick={togglePassword} className="show-password" />
              </div>

              <button type="submit" className="submit">
                Log into your account
              </button>
            </form>
          </FormProvider>

        </div>
      </div>
    </div>
  );
}

export default Login;
