import React, { PropsWithChildren } from "react";
import Header from "../header/header";
import SideBar from "../sidebar/sidebar";
import "./main-layout.scss";
import MenuDrawer from '../../../assets/images/menu-slider-icon.svg'
class MainLayout extends React.Component<PropsWithChildren,any> {
  constructor(props: any) {
    super(props);
    this.state = {
        isOpen :false
    }
}
  render() {
    return (
      <div className="wrap">
        <div className={`left-sec ${this.state.isOpen ? 'open' : 'close'}`} >
          <SideBar />
        </div>
        <div className="right-sec">
          <img onClick={()=>this.setState({isOpen:!this.state.isOpen})} src={MenuDrawer} className="mobile-menu-drawer" alt="" />
          <Header />
          <main className="main">{this.props.children}</main>
        </div>
      </div>
    );
  }
}

export default MainLayout;
