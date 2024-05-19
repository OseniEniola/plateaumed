import React from "react"
import './sidebar.scss';
import Logo from '../../../assets/images/nigenius.svg';
import Dashboard from '../../../assets/images/dashboard.svg';
import LessonPlan from '../../../assets/images/lessonplan.svg';
import Analytics from '../../../assets/images/analytics.svg';
import Packages from '../../../assets/images/packages.svg';
import Subscription from '../../../assets/images/subscription.svg';
import Tutor from '../../../assets/images/tutor.svg';
import Settings from '../../../assets/images/settings.svg';
import Academics from '../../../assets/images/academics.svg'
import TechResource from '../../../assets/images/tech-resources.svg'
import { Link, NavLink } from "react-router-dom";
import { getLoggedInUser } from "../../../data/helpers/services";
import {Roles} from '../../../data/helpers/enum.data';


const UserNavs = [
    {nav: <NavLink className={({ isActive }) => (isActive ? 'active' : 'inactive')} to='/app/dashboard'><li><img src={Dashboard} alt="dashboard" /> Dashboard</li></NavLink>, roles:[Roles.ADMIN,Roles.OPERATIONS,Roles.SUPER_ADMIN]},
    {nav: <NavLink className={({ isActive }) => (isActive ? 'active' : 'inactive')} to='/app/analytics/tutor-metrics'><li><img src={Dashboard} alt="dashboard" /> Dashboard</li></NavLink>, roles:[Roles.SALES]},// Dashboard Nav for Sales Role
    {nav:<NavLink className={({ isActive }) => (isActive ? 'active' : 'inactive')} to='/app/lesson'><li><img src={LessonPlan} alt="lesson plan" /> Lesson Plan</li></NavLink>, roles:[Roles.ADMIN,Roles.OPERATIONS,Roles.SUPER_ADMIN]},
    {nav:<NavLink className={({ isActive }) => (isActive ? 'active' : 'inactive')} to='/app/tech-resource'> <li><img src={TechResource} alt="tech resources"/> Tech Based Resources</li></NavLink>, roles:[Roles.ADMIN,Roles.OPERATIONS,Roles.SUPER_ADMIN]},
    {nav:<NavLink className={({ isActive }) => (isActive ? 'active' : 'inactive')} to='/app/reporting'> <li><img src={Analytics} alt="analytics"/> Analytics</li></NavLink>,roles:[Roles.ADMIN,Roles.OPERATIONS,Roles.SUPER_ADMIN]},
    {nav:<NavLink className={({ isActive }) => (isActive ? 'active' : 'inactive')} to='/app/packages'><li><img src={Packages} alt="packages" /> Packages</li></NavLink>,roles:[Roles.ADMIN,Roles.SUPER_ADMIN]},
    {nav:<NavLink className={({ isActive }) => (isActive ? 'active' : 'inactive')} to='/app/subscriptions'><li><img src={Subscription} alt="subscription" /> Subscription</li></NavLink>,roles:[Roles.ADMIN,Roles.SUPER_ADMIN]},
    {nav:<NavLink className={({ isActive }) => (isActive ? 'active' : 'inactive')} to='/app/academics'><li><img src={Academics} alt="academics" />Academic</li></NavLink>,roles:[Roles.ADMIN,Roles.OPERATIONS,Roles.SUPER_ADMIN]},
    {nav:<NavLink className={({ isActive }) => (isActive ? 'active' : 'inactive')} to='/app/tutors'><li><img src={Tutor} alt="tutor area" />Tutor Area</li></NavLink>,roles:[Roles.ADMIN,Roles.SALES,Roles.SUPER_ADMIN]},
    {nav:<NavLink className={({ isActive }) => (isActive ? 'active' : 'inactive')} to='/app/account-setting'> <li><img src={Settings} alt="setting" /> Settings</li></NavLink>,roles:[Roles.ADMIN,Roles.SUPER_ADMIN]},
    {nav:<NavLink className={({ isActive }) => (isActive ? 'active' : 'inactive')} to='/app/settings/site-configuration'> <li><img src={Settings} alt="setting" /> Settings</li></NavLink>,roles:[Roles.SALES]} //Setting Nav for sales role

]
class SideBar extends React.Component {

    
    render() {
        return (
            <div className="sidebarWrap">
                <div className='sidebarLogo'>
                   <Link to={'/app/dashboard'}> <img src={Logo} alt="Nigenius" title='Nigenius' /></Link>
                </div>

                <div className="sidebarWrapper">
                    {/* <NavLink className={({ isActive }) => (isActive ? 'active' : 'inactive')} to='/app/user'> <li><img src={UserManagement}alt="user management" /> User Management</li></NavLink> */}
                    {/* <NavLink className={({ isActive }) => (isActive ? 'active' : 'inactive')} to='/app/admin'><li><img src={Admin} alt="admin" /> Admin</li></NavLink> */}
                    {/* <NavLink className={({ isActive }) => (isActive ? 'active' : 'inactive')} to='/app/orders-requests'><li><img src={Orders} alt="order and requests" />Orders & Requests</li></NavLink> */}
                    {UserNavs.filter(e=> {return e.roles?.includes(getLoggedInUser()?.admin.role as string)}).map((nav,idc)=>{
                        return <div key={idc}>{nav.nav}</div>
                    })}
                </div>
                {/* <div className="logout">
                    <li><img src={LogOut}/> Logout</li>
                </div>  */}
            </div>
        )
    }
}

export default SideBar