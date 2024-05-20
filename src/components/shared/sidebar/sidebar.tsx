import React from "react"
import './sidebar.scss';
import Logo from '../../../assets/images/plateaumed_logo.webp';
import Dashboard from '../../../assets/images/dashboard.svg';
import StudentIcon from '../../../assets/images/student-icon.svg';
import TeacherIcon from '../../../assets/images/teacher-icon.svg';
import Logout from '../../../assets/images/logout.svg';


import {Link, Navigate, NavLink} from "react-router-dom";
import { getLoggedInUser } from "../../../helpers/services/loginservice";
import {Roles} from '../../../common/data/roles-enum';


const UserNavs = [
/*
    {nav: <NavLink className={({ isActive }) => (isActive ? 'active' : 'inactive')} to='/app/dashboard'><li><img src={Dashboard} alt="dashboard" /> Dashboard</li></NavLink>, roles:[Roles.ADMIN,Roles.TEACHER,Roles.STUDENT]},
*/
    {nav: <NavLink className={({ isActive }) => (isActive ? 'active' : 'inactive')} to='/app/students-list'><li><img src={StudentIcon} alt="Students list" /> Student Management</li></NavLink>, roles:[Roles.TEACHER,Roles.ADMIN]},
    {nav:<NavLink className={({ isActive }) => (isActive ? 'active' : 'inactive')} to='/app/teachers-list'><li><img src={TeacherIcon} alt="Teacher's list" /> Teacher Management</li></NavLink>, roles:[Roles.ADMIN,]},

]
class SideBar extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
        this.state = {
            navigate: false
        };
    }
    logout = () => {
        localStorage.removeItem("authUser");
        this.setState({ navigate: true });
    };
    render() {
        const navigate = this.state.navigate;
        // here is the important part
        if (navigate) {
            return <Navigate to="/" replace={true} />;
        }
        return (

            <div className="sidebarWrap">

                <div className='sidebarLogo'>
                   <Link to={'/app/dashboard'}> <img src={Logo} alt="Nigenius" title='Nigenius' /></Link>
                </div>

                <div className="sidebarWrapper">
                    {UserNavs.filter(e=> {return e.roles?.includes(getLoggedInUser()?.role as string)}).map((nav,idc)=>{
                        return <div key={idc}>{nav.nav}</div>
                    })}
                </div>
                 <div onClick={this.logout} className="logout">
                    <li><img src={Logout}/> Logout</li>
                </div>
            </div>
        )
    }
}

export default SideBar
