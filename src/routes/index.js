import React from "react";

const Login = React.lazy(()=> import('../pages/login/Login.js'))
const CreateStudent = React.lazy(()=> import('../pages/student/createStudent'))
const CreateTeacher = React.lazy(()=> import('../pages/teachers/createTeacher'))
const Dashboard = React.lazy(()=> import('../pages/dashboard/dashboard'))
const TeacherList = React.lazy(()=> import('../pages/teachers/list/teacher-list'))
const StudentList = React.lazy(()=> import('../pages/student/list/student-list'))
const SignUpUser = React.lazy(()=> import('../pages/signup/signup'))



const publicRoutes = [
    //Authentication related routes
    { path: "login", component: Login },
    { path: "create-student", component: CreateStudent },
    { path: "create-teacher", component: CreateTeacher },
    { path: "signup-user", component: SignUpUser },

]


const Roles = {
    ADMIN:'ADMIN',
    STUDENT:'STUDENT',
    TEACHER:'TEACHER',
}

const authProtectedRoutes = [
/*
    { path: "app/dashboard", component: Dashboard ,roles:[Roles.ADMIN,Roles.TEACHER,Roles.STUDENT]},
*/
    { path: "app/teachers-list", component: TeacherList ,roles:[Roles.ADMIN,Roles.TEACHER]},
    { path: "app/students-list", component: StudentList,roles:[Roles.ADMIN,Roles.TEACHER]},
]

export {publicRoutes,authProtectedRoutes,Roles}
