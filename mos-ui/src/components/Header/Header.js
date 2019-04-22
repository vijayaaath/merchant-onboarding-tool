import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Nav,
  NavItem,
  NavbarToggler,
  NavbarBrand,
  NavLink,
  Badge,Button
} from 'reactstrap';

import HeaderDropdown from './HeaderDropdown';

import { browserHistory } from 'react-router';

class Header extends Component {

  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);    
    document.body.classList.toggle('sidebar-hidden');
  }
  
  gotoAddOffer(e){
    e.preventDefault();
    var self = this;
   
    const { history } = self.props;
    history.push('/addoffer');
  }


  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  handleLogout(e)
  {
    e.preventDefault();
    var self = this;
    localStorage.setItem('auth', '');
    const { history } = self.props;
    history.push('/admin/userlist');
  }

  render() {

    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>

        <NavbarToggler  className="d-md-down-none" onClick={this.sidebarToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>

        <NavbarBrand  href="#"></NavbarBrand>
        
        

        <Nav className="ml-auto" navbar>
        <Button outline color='primary' onClick={this.gotoAddOffer.bind(this)} className="top-add-offer">ADD OFFER</Button>
        <HeaderDropdown {...this.props}/>&nbsp;
       

         </Nav>






      </header>
    );
  }
}

export default Header;
