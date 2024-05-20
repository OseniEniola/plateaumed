import "./signup.scss";
import {Link, useNavigate} from "react-router-dom";
import React, { useState } from "react";
import { ArrowLeftCircle } from "react-bootstrap-icons";
import { Circles } from "react-loader-spinner";
import CreateStudent from '../student/createStudent.js';
import CreateTeacher from '../teachers/createTeacher.js'
import Logo from "../../assets/images/plateaumed_logo.webp";
function SignUpUser() {
    const  reportObject = {reportType:''}
    const [formValues, setFormValues] = useState(reportObject);
    const [isLoading, setIsLoading] = useState(false);
    const [isReportTypeSelected, setisReportTypeSelected] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const goBack = () => {
        if (currentPage == 2) {
            setCurrentPage(1);
        } else if (currentPage == 1) {
            setCurrentPage(1);
            setisReportTypeSelected(false);
        } else {
            navigate(-1);
        }
    };


    return (
        <div>
            {isLoading && isLoading ? (
                <div className="overlay">
                    <Circles
                        height="50"
                        width="50"
                        color="#fff"
                        ariaLabel="circles-loading"
                        wrapperStyle={{}}
                        wrapperClass="loading-spinner"
                        visible={true}
                    />
                </div>
            ) : (
                ""
            )}
            <div className="logo-right report">
                <Link to={'/'}><img src={Logo} alt="Plateaumed" title="Plateaumed" /></Link>
            </div>
            {isReportTypeSelected ? (
                <button onClick={() => goBack()} className="back-button-report">
                    <ArrowLeftCircle /> Go back
                </button>
            ) : (
                ""
            )}

            <div className="create_group form-report no-top-margin">

                {!isReportTypeSelected ? (
                    <div className="selection-card">
                        <div className="title_wrap">
                            <div className="title1">Choose Report Type</div>
                            <br />
                        </div>
                        <div
                            className="card"
                            onClick={() => {
                                setFormValues({ ...formValues, reportType: "student" });
                                setisReportTypeSelected(true);
                            }}
                        >
                            <p className="bold">Create a student profile</p>
                            <p className="light">Click to proceed</p>
                        </div>
                        <div
                            className="card"
                            onClick={() => {
                                setFormValues({ ...formValues, reportType: "teacher" });
                                setisReportTypeSelected(true);
                            }}
                        >
                            <p className="bold">Create a teacher profile </p>
                            <p className="light">Click to proceed</p>
                        </div>
                    </div>
                ) : (
                    <div className="form_wrap">
                        {formValues.reportType?.toLowerCase() == "student" ? (
                            //Subject Report form
                            <CreateStudent></CreateStudent>
                        ) : (
                            //Coding and robotics form
                           <CreateTeacher></CreateTeacher>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SignUpUser;
