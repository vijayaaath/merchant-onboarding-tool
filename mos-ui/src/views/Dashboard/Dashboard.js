import React, { Component } from 'react';
import {Bar, Doughnut, Line, Pie, Polar, Radar} from 'react-chartjs-2';
import {Badge, Row, Col, Card, CardHeader, CardFooter, CardBody, Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CardGroup, } from 'reactstrap';
import { API_ROOT } from '../../api-config';
import axios from 'axios';
import Widget04 from './Widget04';
import { loadProgressBar } from 'axios-progress-bar';
import 'axios-progress-bar/dist/nprogress.css';



const polar = {
  datasets: [{
    data: [
      11,
      16,
      7,
      3,
      14
    ],
    backgroundColor: [
      '#FF6384',
      '#4BC0C0',
      '#FFCE56',
      '#E7E9ED',
      '#36A2EB'
    ],
    label: 'My dataset' // for legend
  }],
  labels: [
    'Red',
    'Green',
    'Yellow',
    'Grey',
    'Blue'
  ]
};

class Dashboard extends Component {



  constructor() {
    super();
    this.state = {
      noOfActiveBrands: '',
      noOfActiveOutlets: '',
      noOfActiveAccount: '',
      noOfActiveOffers: '',
      pendingOffers: '',
      expiringOffers: '',
      activeBrandsKeyArray: [],
      activeBrandsValueArray: [],
      activeOffersKeyArray: [],
      activeOffersValueArray: [],
      activeOffersOverTimeKeyArray: [],
      activeOffersOverTimeValueArray: []
    };
    this.active_offers = this.active_offers.bind(this);
    this.pending_offers = this.pending_offers.bind(this);
    this.epired_offers = this.epired_offers.bind(this);
    this.go_brands = this.go_brands.bind(this);
    this.go_merchant = this.go_merchant.bind(this);
    
    
  }



  componentDidMount()
  {
    document.body.classList.toggle('sidebar-hidden');
    this.loadAPI();

  }


  active_offers()
  {    
    if(localStorage.getItem('role') == 'ADMIN'){
      const { history } = this.props;
      history.push('/ManageOffers/active');
    }
    
  }
  pending_offers()
  {    
    if(localStorage.getItem('role') == 'ADMIN'){
      const { history } = this.props;
      history.push('/ManageOffers/pending');
    }
  }
  epired_offers()
  { 
    if(localStorage.getItem('role') == 'ADMIN'){
      const { history } = this.props;
      history.push('/ManageOffers/expired');
    }
  }
  go_brands()
  {
    if(localStorage.getItem('role') == 'ADMIN'){
      const { history } = this.props;
      history.push('/ManageBrands/'+this.state.noOfActiveBrands);
    }
  }
  go_merchant()
  {
    if(localStorage.getItem('role') == 'ADMIN'){
      const { history } = this.props;
      history.push('/MerchantList');
    }
  }

  loadAPI()
  {
    var auth = localStorage.getItem('auth');
    loadProgressBar();
    var self = this;
    var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours()+ ':' + today.getMinutes()+ ':' + today.getSeconds();
    var body = {};

    axios({
        method: 'get',
        url: API_ROOT+'api/stats/entities?status=ACTIVE',
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
         self.setState({noOfActiveAccount: response.data.merchants});
         self.setState({noOfActiveOutlets: response.data.outlets});
         self.setState({noOfActiveBrands: response.data.brands});
         self.setState({noOfActiveOffers: response.data.offers});
      })
      .catch(function (error) {
         
      }.bind(this));


      var pendingOffersBody = {

        "time" : date

      };
      axios({
        method: 'post',
        url: API_ROOT+'api/stats/offers?status=PENDING',
        data: pendingOffersBody,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
         self.setState({pendingOffers: response.data.count});
      })
      .catch(function (error) {
         
      }.bind(this));



      var expiringOffersBody = {

        "time" : date

      };


      axios({
        method: 'post',
        url: API_ROOT+'api/stats/offers?status=EXPIRED',
       // data: expiringOffersBody,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
         self.setState({expiringOffers: response.data.count});
      })
      .catch(function (error) {
         
      }.bind(this));


      axios({
        method: 'get',
        url: API_ROOT+'api/stats/categories?groupby=brand',
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
  
           var contentKeys = Object.keys(response.data);
           var contentValues = Object.values(response.data);

           contentKeys.map((obj, key)=> {
               self.setState({activeBrandsKeyArray: [...self.state.activeBrandsKeyArray, obj]});
            })

           contentValues.map((obj, key)=> {
               self.setState({activeBrandsValueArray: [...self.state.activeBrandsValueArray, obj]});
            })

      })
      .catch(function (error) {

      }.bind(this));


      axios({
        method: 'get',
        url: API_ROOT+'api/stats/categories?groupby=offer',
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
  
           var contentKeys = Object.keys(response.data);
           var contentValues = Object.values(response.data);

           contentKeys.map((obj, key)=> {
               self.setState({activeOffersKeyArray: [...self.state.activeOffersKeyArray, obj]});
            })

           contentValues.map((obj, key)=> {
               self.setState({activeOffersValueArray: [...self.state.activeOffersValueArray, obj]});
            })

      })
      .catch(function (error) {

      }.bind(this));



      var activeOffersOverTimeBody = {

        "time" : date

      };
      axios({
        method: 'post',
        url: API_ROOT+'api/stats/offers?status=ACTIVE&distribution=true',
        data: activeOffersOverTimeBody,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
  
           var contentKeys = Object.keys(response.data);
           var contentValues = Object.values(response.data);

           contentKeys.map((obj, key)=> {
               self.setState({activeOffersOverTimeKeyArray: [...self.state.activeOffersOverTimeKeyArray, obj]});
            })

           contentValues.map((obj, key)=> {
               self.setState({activeOffersOverTimeValueArray: [...self.state.activeOffersOverTimeValueArray, obj]});
            })

      })
      .catch(function (error) {

      }.bind(this));






  }



  render() {
    const pie = {
  labels: this.state.activeBrandsKeyArray,
  datasets: [{
    data: this.state.activeBrandsValueArray,
    backgroundColor: [
      '#fee555',
      '#145f8b',
      '#8accf0',
      '#0395c4',
      '#cddcf1',
      '#fdc010',
      '#255f92',
      '#61C2A4',
      '#719FD4',
      '#7BBFE9'
    ],
    hoverBackgroundColor: [
      '#fee555',
      '#145f8b',
      '#8accf0',
      '#0395c4',
      '#cddcf1',
      '#fdc010',
      '#255f92',
      '#FBBC86',
      '#F49DBF',
      '#7BBFE9'
    ]
  }]
};


const pie1 = {
  labels: this.state.activeOffersKeyArray,
  datasets: [{
    data: this.state.activeOffersValueArray,
    backgroundColor: [
      '#fee555',
      '#145f8b',
      '#8accf0',
      '#0395c4',
      '#cddcf1',
      '#fdc010',
      '#255f92',
      '#61C2A4',
      '#719FD4',
      '#7BBFE9'
    ],
    hoverBackgroundColor: [
      '#fee555',
      '#145f8b',
      '#8accf0',
      '#0395c4',
      '#cddcf1',
      '#fdc010',
      '#255f92',
      '#FBBC86',
      '#F49DBF',
      '#7BBFE9'
    ]
  }]
};



const line = {
  labels: this.state.activeOffersOverTimeKeyArray,
  datasets: [
    {
      label: 'Active Offers Over Time',
      fill: true,
      lineTension: 0.1,
      backgroundColor: 'rgba(123,191,233,0.4)',
      borderColor: '#7BBFE9',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: '#fff',
      pointBackgroundColor: '#7BBFE9',
      pointBorderWidth: 1,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#4cabdf',
      pointHoverBorderColor: 'rgba(76,171,223,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 4,
      pointHitRadius: 10,
      data: this.state.activeOffersOverTimeValueArray
    }
  ]
};




    return (
      <div className="animated fadeIn">    

        <Row>
          <Col xs="12" lg="4" sm="12" md="4" onClick={this.active_offers} className={localStorage.getItem('role') == 'ADMIN' ? "cursor-pointer" : "" }>
            <Widget04 icon="" color="warning" header={this.state.noOfActiveOffers} value="20" className="card-border">Active Offers
</Widget04>
          </Col>
          <Col xs="12" lg="4" sm="12" md="4" onClick={this.pending_offers} className={localStorage.getItem('role') == 'ADMIN' ? "cursor-pointer" : "" }>
            <Widget04 icon="" color="warning" header={this.state.pendingOffers} value="20" className="card-border">Pending Offers
</Widget04>
          </Col>
          <Col xs="12" lg="4" sm="12" md="4" onClick={this.epired_offers} className={localStorage.getItem('role') == 'ADMIN' ? "cursor-pointer" : "" }>
            <Widget04 icon="" color="warning" header={this.state.expiringOffers} value="20" className="card-border">Expiring Offers
</Widget04>
          </Col>
        </Row>


        <Row>
          <Col xs="12" lg="4" sm="12" md="4" onClick={this.go_brands} className={localStorage.getItem('role') == 'ADMIN' ? "cursor-pointer" : "" }>
            <Widget04 icon="" color="info" header={this.state.noOfActiveBrands} value="20" className="card-border">Brands
</Widget04>
          </Col>
          <Col xs="12" lg="4" sm="12" md="4">
            <Widget04 icon="" color="info" header={this.state.noOfActiveOutlets} value="20" className="card-border">Outlets
</Widget04>
          </Col>
          <Col xs="12" lg="4" sm="12" md="4">
            <Widget04 icon="" color="info" header={this.state.noOfActiveAccount} value="20" className="card-border">Accounts</Widget04>
          </Col>
        </Row>
        

        <Row className="mt-3">

             <Col xs="12" sm="6" md="6">
                <Card className="card-border">
                  <CardHeader className="text-center pie-chart-header chart-header-bg card-header-border">
                    <h5 className="pie-chart-title chart-title-margin-zero">Brand distribution</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-wrapper">
                      <Pie data={pie}/>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col xs="12" sm="6" md="6">
                 <Card className="card-border">
                  <CardHeader className="text-center pie-chart-heaer chart-header-bg card-header-border">
                    <h5 className="pie-chart-title chart-title-margin-zero">Offer distribution</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-wrapper">
                      <Pie data={pie1}/>
                    </div>
                  </CardBody>
                </Card>
              </Col>
        </Row>

        <Row>
          <Col xs="12" sm="12" md="12">
            <Card className="card-border">
              <CardHeader className="text-center pie-chart-heaer chart-header-bg card-header-border">
                    <h5 className="pie-chart-title chart-title-margin-zero">Active Offers Over Time</h5>
              </CardHeader>
              <CardBody>
                <div className="chart-wrapper">
                  <Line data={line}
                        options={{
                      maintainAspectRatio: false
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>



      </div>
    )
  }
}

export default Dashboard;
