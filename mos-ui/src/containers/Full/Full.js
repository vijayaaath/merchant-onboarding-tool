import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

// Crayon
import Dashboard from '../../views/Dashboard/';
import UserDetail from '../../views/Admin/UserDetail/';
import UserProfile from '../../views/Admin/UserProfile/';
import BaseBrand from '../../views/brand/base.js'; // added by dhruv on 28th feb 2018
import FindBrand from '../../views/brand/FindBrand.js'; // added by dhruv on 28th feb 2018
import UserList from '../../views/Admin/UserList';
import MerchantAccount from '../../views/MerchantAccount/MerchantAccount';
import AccountBase from '../../views/MerchantAccount/AccountBase';
import FindAccount from '../../views/MerchantAccount/FindMerchant';
import ManageOffers from '../../views/ManageOffers/ManageOffer';
import ManageBrands from '../../views/brand/ManageBrands';
import AddOffer_1 from '../../views/AddOffer/AddOffer_Seperate';

import ManageMerchant from '../../views/ManageMerchant/';


class Full extends Component {

 reload(){
   window.location.reload();
 }
  
  render() {



     function isLoggedIn() {
      if(localStorage.getItem('auth') == '' || localStorage.getItem('tenantName') == '' || localStorage.getItem('tenantName') == null || localStorage.getItem('tenantName') == 'undefined')
        {
            return false;
        }
        else
          {
            return true;
          }
          
    }
    function isbrandId(){
      if(localStorage.getItem('brandName') == null)
      {
          return false;
      }
      else
        {
          if(window.location.href.split('#brandName=') != undefined){
            return true;
          }else{
            return false;
          }
          
        }
    }


    return (
      <div className="app">
        <Header {...this.props} />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              <Switch>
                <Route path="/dashboard" name="Dashboard" render={(props) => (
  isLoggedIn() == false ? (
    <Redirect to="/login"/>
  ) : (
    <Dashboard {...props} />
  )
)}/>


                <Route path="/admin/userdetail/:uid?" name="UserDetail" render={(props) => (
  isLoggedIn() == false ? (
    <Redirect to="/login"/>
  ) : (
    <UserDetail {...props} />
  )
)}/>

<Route path="/admin/profile/:uid?" name="UserProfile" render={(props) => (
  isLoggedIn() == false ? (
    <Redirect to="/login"/>
  ) : (
    <UserProfile {...props} />
  )
)}/>

                <Route path="/admin/userlist" name="Userlist" render={() => (
  isLoggedIn() == false ? (
    <Redirect to="/login"/>
  ) : (
    <UserList />
  )
)}/>



                <Route path="/createaccount/:merchantid?" name="MerchantAccount" render={(props) => (
  isLoggedIn() == false ? (
    <Redirect to="/login"/>
  ) : (
    <MerchantAccount {...props} />
  )
)}/>


                   <Route path="/findaccount/:msg?" name="FindAccount" render={(props) => (
  isLoggedIn() == false ? (
    <Redirect to="/login"/>
  ) : (
    <FindAccount {...props} />
  )
)}/>


<Route path="/accountprofile/:merchantid?" name="AccountProfile" render={(props) => (
  isLoggedIn() == false ? (
    <Redirect to="/login"/>
  ) : (
    <AccountBase {...props} />
  )
)}/>


<Route path="/managemerchant/:merchantid?/:tabshow?/:msg?/" name="ManageMerchant" render={(props) => (
  isLoggedIn() == false ? (
    <Redirect to="/login"/>
  ) : (
    <ManageMerchant {...props} />
  )
)}/>


<Route path="/base"  name='BaseBrand' onChange={this.reload.bind(this)} render={(props) => (
                                        isLoggedIn() == false ? (
                                          <Redirect to="/login"/>
                                        ) : (isbrandId() == false)?(<Redirect to="/FindBrand"/>): (
                                          <BaseBrand {...props}/>
                                        )
                                      )}/>
                                      <Route path="/FindBrand"  name='Find Brand' onChange={this.reload.bind(this)} render={(props) => (
                                        isLoggedIn() == false ? (
                                          <Redirect to="/login"/>
                                        ) : (
                                          <FindBrand {...props}/>
                                        )
                                      )}/>
                <Route path="/ManageOffers/:offertype?"  name='ManageOffers' onChange={this.reload.bind(this)} render={(props) => (
                                        isLoggedIn() == false ? (
                                          <Redirect to="/login"/>
                                        ):(
                                          <ManageOffers {...props}/>
                                        )
                                      )}/>

              <Route path="/ManageBrands/:brandtype?"  name='ManageBrands' onChange={this.reload.bind(this)} render={(props) => (
                                        isLoggedIn() == false ? (
                                          <Redirect to="/login"/>
                                        ):(
                                          <ManageBrands {...props}/>
                                        )
                                      )}/>
                                      
                                      <Route path="/addoffer" name='AddOffer_1' render={() => (
                                        isLoggedIn() == false ? (
                                          <Redirect to="/login"/>
                                        ) : (
                                          <AddOffer_1/>
                                        )
                                      )}/>
                <Route path="/" render={() => (
  isLoggedIn() == false ? (
    <Redirect to="/login"/>
  ) : (
    <Redirect to="/dashboard"/>
  )
)}/>

              </Switch>
            </Container>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Full;
