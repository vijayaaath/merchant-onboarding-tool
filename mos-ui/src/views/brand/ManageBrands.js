import React, { Component } from 'react';
import classnames from 'classnames';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Loader from 'react-loader-spinner'
import 'react-datepicker/dist/react-datepicker.css';
import {Badge, Row, Col, Card, CardHeader, CardFooter, CardBody, Button,Dropdown,
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
  


} from 'reactstrap';
import { API_ROOT } from '../../api-config';
import axios from 'axios';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

function validate(){

}




class ManageBrands extends Component {



  constructor(props) {
    super(props);
    //this.toggleHandle = this.toggleHandle.bind(this)
    const no_of_pages = Math.round(this.props.match.params.brandtype / 20);
      this.state = {
        offers:[],
        categories: [{value: 'all',label: "All"}],
        selectedOption: '',        
        search:'',
        pages: no_of_pages,
        currentPage: 0,
        loading: false,
        displayTable:true,
        noOfElement: '',
        columns : [
            {
          
                Header: 'S. No',
               show:true,
               id: "row",
               width: 50,
               Cell: (row) => {
                
                return <div>{row.index+1+(this.state.currentPage * 20)}</div>;
              }

              },
              {
          
                Header: 'Brand Name',
               accessor:'name',
               show:true
              },
            {
                Header: 'Category',
                accessor: 'category',
                show:true,
               
              
              },
            {
            Header: 'Country',
            accessor: 'merchant.address.country',
            show:true,
        }, 
        {
          Header: 'Tags Flag',
          accessor: 'tags',
          show:true,
          width: 100,
          className: "table-text-center",
          Cell:prop=>{
            return <span>{prop.value.length > 0 ? <span> <i className="fa fa-tags fa-lg mt-4"></i></span> : <span></span> }</span>
          }
      }, 
          {
          
            Header: 'Action',
            filterable:false,
            width: 50,
            className: "table-text-center",
            Cell:prop=>{
             return <i className="fa fa-edit fa-lg"></i>
           }
          }
          
        ]
      };

      this.onRowClick = this.onRowClick.bind(this);
      this.fetchdata = this.fetchdata.bind(this);
      this.handleChange = this.handleChange.bind(this);
        
            
        
    };
  
      
onRowClick(state, rowInfo, column, instance){
  return {
    onClick: e => {
     
      if(column.Header == "Action")
      {
        localStorage.setItem('brandName', rowInfo.original.name)
        const { history } = this.props;
        history.push('/base#brandName='+rowInfo.original.name);
      }
      
      }
    }
}

fetchdata(state, instance){
  if(this.state.selectedOption.value == 'all' || this.state.selectedOption.value == undefined){
          var auth = localStorage.getItem('auth');  
          var body = {};    
          var that = this;  
          axios({
            method: 'get',
            url: API_ROOT+'api/brands?page='+state.page+'&size=20',
            data: body,
            headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}
        
          })
          .then(function (response) {
            localStorage.setItem('auth', auth);
            that.setState({currentPage:state.page});
            that.setState({offers:response.data.content});
            that.setState({noOfElement:response.data.totalElements});
            that.setState({pages:Math.round(response.data.totalElements / 20)});
        
        })
        .catch(function (error) {
        
        }.bind(this));
  }
  else{
          var auth = localStorage.getItem('auth');  
          var body = {};    
          var that = this;  
          axios({
            method: 'get',
            url: API_ROOT+'api/brands/byCategory?categoryName='+that.state.selectedOption.value+'&page='+state.page+'&size=20',
            data: body,
            headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}
        
          })
          .then(function (response) {
            localStorage.setItem('auth', auth);
            that.setState({currentPage:state.page});
            that.setState({offers:response.data.content});
            that.setState({noOfElement:response.data.totalElements});
            that.setState({pages:Math.round(response.data.totalElements / 20)});
        
        })
        .catch(function (error) {
        
        }.bind(this));
  }
    

  

}
 

  componentDidMount(){
    this.getAllOffers();
    this.getCategory();
  }
  toggle() {
    
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  getCategory()
  {
    var auth = localStorage.getItem('auth');
    var that = this;
    var body = {};
    axios({
        method: 'get',
        url: API_ROOT+'/api/brands/categories',
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

      })
      .then(function (response) {
       // that.setState({categories:response.data.content})
        response.data.map((obj, key)=> {

          that.setState({categories: [...that.state.categories, {value: obj,label: obj}]});
    });
    
    })
    .catch(function (error) {
    
    
    }.bind(this)); 
  }


  getAllOffers(){
    var auth = localStorage.getItem('auth');
 
    var that = this;
  
    var body = {};    
    var userId = localStorage.getItem('userId');
    if(this.props.match.params.offertype)
    {
        var offerType = this.props.match.params.offertype;
        if(offerType == '' || offerType == 'undefined')
        {
            offerType = 'all';
        }
    }
    else
    {
        var offerType = 'all';
    }
    
    return  axios({
       method: 'get',
       url: API_ROOT+'api/brands?page='+this.state.currentPage+'&size=20',
       data: body,
       headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

     })
     .then(function (response) {
     localStorage.setItem('auth', auth);
    that.setState({offers:response.data.content});
    that.setState({noOfElement:response.data.totalElements});
    that.setState({pages:Math.round(response.data.totalElements / 20)});
     
    
    
   })
   .catch(function (error) {
    
   
   }.bind(this)); 
  }
 
reactTable(){
    if(this.state){
        if(this.state.offers.length > 0  && this.state.displayTable){
            var data = this.state.offers;
            if (this.state.search) {
      
                data = data.filter(row => {
                 
                    return row.name.toLowerCase().includes(this.state.search.toLowerCase()) || row.category.toLowerCase().includes(this.state.search.toLowerCase()) ||
                    row.merchant.address.country.toLowerCase().includes(this.state.search.toLowerCase()) 
                   
                    
                })
            }

            
            return <ReactTable
            data={data}
            columns={this.state.columns}
            defaultPageSize={20}
            showPageSizeOptions={false}
            getTdProps={this.onRowClick}
            loading={this.state.loading}
            pages={this.state.pages}
            manual
            onFetchData={(state, instance) => {
              // show the loading overlay
              this.fetchdata(state, instance);

            }}
           
            
        />
        }else{
            return <div className='loader-class'><div className="align-self-center loader"><img src="img/loader.gif" /></div></div> 
        }
    }
}

handleChange(selectedOption)
{
  this.setState({ selectedOption });
  this.setState({ loading : true });


  if(selectedOption.value == 'all'){
              var auth = localStorage.getItem('auth');
            
              var body = {};  
              
              var that = this;  

            axios({
              method: 'get',
              url: API_ROOT+'api/brands?page=0&size=20',
              data: body,
              headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

            })
            .then(function (response) {
              localStorage.setItem('auth', auth);
              that.setState({currentPage:0});
              that.setState({offers:response.data.content});
              that.setState({noOfElement:response.data.totalElements});
              that.setState({pages:Math.round(response.data.totalElements / 20)});
              that.setState({ loading : false });
          })
          .catch(function (error) {

          }.bind(this)); 
  }
  else{

    var auth = localStorage.getItem('auth');
    var body = {};  
    var that = this; 
    var selected_category = selectedOption.value;
        
      axios({
        method: 'get',
        url: API_ROOT+'api/brands/byCategory?categoryName='+selected_category,
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}
    
      })
      .then(function (response) {
        localStorage.setItem('auth', auth);
        that.setState({currentPage:0});
        that.setState({offers:response.data.content});
        that.setState({noOfElement:response.data.totalElements});
        that.setState({pages:Math.round(response.data.totalElements / 20)});
        that.setState({ loading : false });
    
      })
      .catch(function (error) {
    
      }.bind(this)); 


  }

}



  render() {
    const { selectedOption} = this.state;
    const value = selectedOption && selectedOption.value;
   
   return (
        <div className="animated fadeIn">
            <h3 className="title-margin-bottom">Brands Onboard</h3>
            <Card className="card-border">
                <CardBody className="card-padding-top">

            
                <span className='pull-right' style={{marginBottom:'20px'}}> <input value={this.state.search} placeholder='Search ...' className='form-control' onChange={e => this.setState({search: e.target.value})}/></span>
                <span className='pull-right'>&nbsp;&nbsp;&nbsp;</span>
                <span className='pull-right'>

                <table className="table-width-brands">
                  <tr>
                      <td><Label htmlFor="disabledSelect">Category&nbsp;&nbsp;</Label></td>
                      <td><Select
                        name="form-field-name"
                        value={value}
                        placeholder="Select category"
                        onChange={this.handleChange}
                        options={this.state.categories}
                        className="dropDown-brands"
                      /></td>
                  </tr>
                </table>                 
                  </span>
                  

                <div className="no-of-brands-left">
                    No. of brands: {this.state.noOfElement}
                </div>


                {this.reactTable()}
                </CardBody>
            </Card>
          
         
         
         
       
        </div>
    )
  }
}

export default ManageBrands;
