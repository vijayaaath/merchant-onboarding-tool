import React, {Component} from 'react';
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown
} from 'reactstrap';

class HeaderDropdown extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.createuser = this.createuser.bind(this);
    this.userslist = this.userslist.bind(this);
    this.profile = this.profile.bind(this);
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }


  handleLogout(e)
  {
    e.preventDefault();
    var self = this;
    localStorage.setItem('auth', '');
    const { history } = self.props;
    history.push('/admin/userlist');
  }
  createuser()
  {
      const { history } = this.props;
      history.push('/admin/userdetail');
  }

  userslist()
  {
      const { history } = this.props;
      history.push('/admin/userlist');
  }

  profile()
  {
      const { history } = this.props;
      history.push('/admin/profile');
  }



  dropAccnt() {
      
      if(localStorage.getItem('userName') && localStorage.getItem('tenantName'))
      {
        var uName = localStorage.getItem('userName');
      }
      else
      {
        var uName = 'Merchant Onboard';
      }
      var str     = uName;
      var matches = str.match(/\b(\w)/g);
      var acronym = matches.join(''); 
    return (
      <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav>
          <div className="user-setting img-avatar"><span className="user-setting-span">{acronym}</span></div>
        </DropdownToggle>
        <DropdownMenu right>
          {localStorage.getItem('role') == 'ADMIN' ? <span><DropdownItem header tag="div" className="text-center"><strong>Manage users</strong></DropdownItem>
          <DropdownItem onClick={this.createuser}><i className="fa fa-user"></i> Create user</DropdownItem>
          <DropdownItem onClick={this.userslist}><i className="fa fa-tasks"></i> Users</DropdownItem></span> : <span></span>}
          <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
          <DropdownItem onClick={this.profile}><i className="fa fa-user"></i> Profile</DropdownItem>
          <DropdownItem onClick={this.handleLogout}><i className="fa fa-lock"></i> Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }




  render() {
    const {attributes} = this.props;
    return (
      this.dropAccnt()
    );
  }
}

export default HeaderDropdown;
