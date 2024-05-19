import * as React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "./header.scss";
import Notification from "../../../assets/images/notification-bing.svg";
import { ChevronDown } from "react-bootstrap-icons";
import Profile from "../../../assets/images/security-user.svg";
import Logout from "../../../assets/images/logout-profile.svg";
import { getLoggedInUser, getNotificationsAPI } from "../../../data/helpers/services";
import { Link, Navigate } from "react-router-dom";
import { NotificationModel } from "../../../pages/settings/notification/model/notification";

export interface State {
   notifications: NotificationModel[];
   navigate: boolean;
}
class Header extends React.Component<any, State> {
   constructor(props: any) {
      super(props);
      this.state = {
         navigate: false,
         notifications: [],
      };
   }
   logout = () => {
      localStorage.removeItem("authUser");
      this.setState({ navigate: true });
   };
   componentDidMount(): void {
      this.getNotifications();
   }
   getNotifications = (query?: any) => {
      getNotificationsAPI()
         .then((res) => {
            this.setState({ notifications: res.data?.data },()=>{
                this.setState({notifications: this.state.notifications.filter(e=>e.isRead == false)},()=>{
                })
            });
         })
         .catch(() => {});
   };
   render() {
      const navigate = this.state.navigate;
      // here is the important part
      if (navigate) {
         return <Navigate to="/" replace={true} />;
      }
      return (
         <div className="header-wrap">
            <Link className="notification_wrap" to={`/app/settings/notification`}>
               <img className="notification" src={Notification} alt="notification" />
               <span>{this.state.notifications.length}</span>
            </Link>
            
            <Dropdown className="profile-dropdown">
               <Dropdown.Toggle variant="success" id="dropdown-basic">
                  <div className="circle">
                     <span className="initials">
                        {getLoggedInUser()?.admin.firstName.charAt(0)}
                        {getLoggedInUser()?.admin.lastName.charAt(0)}
                     </span>
                  </div>{" "}
                  <span>
                     {" "}
                     {getLoggedInUser()?.admin.firstName} {getLoggedInUser()?.admin.lastName}
                  </span>{" "}
                  <ChevronDown />
               </Dropdown.Toggle>

               <Dropdown.Menu>
                  <Dropdown.Item as={Link} to={'/app/account-setting'}>
                     <img src={Profile} alt="profile" /> Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={this.logout}>
                     <img src={Logout} alt="logout" /> Logout
                  </Dropdown.Item>
               </Dropdown.Menu>
            </Dropdown>
         </div>
      );
   }
}

export default Header;
