import React, {useCallback, useEffect, useState} from "react";
import { Eye } from "react-bootstrap-icons";
import Logo from "../../assets/images/plateaumed_logo.webp";
import "./login.scss";
import FormGroup from "../../helpers/form-validation/FormGroup.js"
import {FormProvider,useForm} from "../../helpers/form-validation/FormContext";
import {validateField} from "../../helpers/form-validation/FormUtility";
import toast from "react-hot-toast";
import {Link, useNavigate} from "react-router-dom";
import {signInUser} from "../../helpers/services/api";

const Login =() => {
  return(
    <FormProvider>
      <LoginForm></LoginForm>
    </FormProvider>
  )
}

const LoginForm = () => {
  const { setFieldError, clearFieldError, errors=null } = useForm();
  const [formValues, setFormValues] = useState({email:'',password:''});
  const navigate = useNavigate();



  const handleInputChange = useCallback((e) => {
    const { name, value, required, dataset } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    validateField(name, value,dataset.validationType, formValues, setFieldError, clearFieldError);
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
          fieldElement?.required
      );
    });

    if (Object.keys(errors).length === 0) {

      if(formValues.email && formValues.password){
        toast.promise(signInUser(formValues.email,formValues.password) ,
            {
              loading:"Signing in",
              success: (res) => `Welcome ${res.profile.firstname}`,
              error:(err) => {toast.error(err)}
            }).then((res)=>{
          localStorage.setItem("authUser",btoa(JSON.stringify(res)))
          navigate("/app/dashboard");
          window.location.reload()
        }).catch(err => {console.log(err)})
      }else {
        toast.error('Username and password is required')
      }

    } else {
      console.log('Form has errors');
    }
  };


  const togglePassword = () => {
    var x = document.getElementById("password");
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
          <div className="title1">Login into Plateaumed</div>
          <div className="title2">
            Please enter your registered credentials to access your account
          </div>
         
        </div>

        <div className="form_wrap">
            <form onSubmit={handleSubmit}>
              <div className="input_area">
                <FormGroup label="Username" fieldName="email" required validationType="email">
                  <input
                      className="input_wrap"
                      name="email"
                      value={formValues.email.toString()}
                      data-validation-type="email"
                      onChange={handleInputChange}
                      placeholder="samuelo@gmail.com"
                      type="text"
                  />
                </FormGroup>
              </div>
              <div className="input_area">
                <FormGroup  label="Password" fieldName="password" required validationType="password">
                  <input
                      id={'password'}
                      className="input_wrap"
                      name="password"
                      data-validation-type="password"
                      value={formValues.password.toString()}
                      onChange={handleInputChange}
                      placeholder="******"
                      type="password"
                  />
                </FormGroup>
                <Eye onClick={togglePassword} className="show-password" />
              </div>

              <button type="submit" className="submit">
                Log into your account
              </button>
              <Link to={'signup-user'}><span className={'register-prompt'}>click here to register a student or teacher</span></Link>
            </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
