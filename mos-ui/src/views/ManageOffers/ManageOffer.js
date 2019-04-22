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




class ManageOffers extends Component {



  constructor(props) {
    super(props);
    //this.toggleHandle = this.toggleHandle.bind(this)
      this.state = {
        offers:[],
        search:'',
        displayTable:true,
        loader: true,
        columns : [
            {
          
                Header: 'Account Name',
               accessor:'merchant.name',
               show:true
              },
            {
                Header: 'Brand Name',
                accessor: 'brand.name',
                show:true,
               
              
              },
            {
            Header: 'Offer Desc.',
            accessor: 'shortDesc' ,
            show:true,
        },
           
          {
            Header: 'Offer Mid Desc.',
            accessor: 'medDesc' ,
            show:false,
          },
                    {
            Header: 'Offer Long Desc.',
            accessor: 'longDesc' ,
            show:false
           
          },
          
          {
          
            Header: 'Category',
           accessor:'brand.category',
           show:true
          }, 
          {
          
            Header: 'Start Date',
           accessor:'valid_from',
           Cell:props=>{
                return <span>{props.value.split(' ')[0]}</span>
           },
           show:true
          },
          {
          
            Header: 'End Date',
           accessor:'valid_to',
           Cell:props=>{
            return <span>{props.value.split(' ')[0]}</span>
       },
           show:true
          },
          {
          
            Header: 'Status',
           accessor:'status',
           Cell:props=>{
            return <Badge pill color={(props.value == 'active' || props.value == 'LIVE')?'green':'red'}   >{props.value} </Badge>
           },
           show:true
          },
          {
          
            Header: 'No. of Outlets',
           accessor:'offerRedeemOutlets.length',
           show:true
          },
          
          {
          
            Header: 'Redemption URL',
           accessor:'redeemUrl',
           show:false
          }
          
        ],
        dropdownOpen:false
      }
        
            
        
    };
  
  
 

  componentDidMount(){
    this.getAllOffers();
    var a = 0;
    for(a = 0;a<10;a++){
        setTimeout((a)=>{
         
        },0)
    }
  }
  toggle() {
    
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
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
       url: API_ROOT+'api/offersByUser?userId='+userId+'&status='+offerType,
       data: body,
       headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

     })
     .then(function (response) {
     localStorage.setItem('auth', auth);
    
    
    that.setState({offers:response.data})
    that.setState({loader : false});
    
    
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
                 
                    return row.merchant.name.toLowerCase().includes(this.state.search.toLowerCase()) || row.brand.name.toLowerCase().includes(this.state.search.toLowerCase()) || (row.shortDesc.toLowerCase()).includes(this.state.search.toLowerCase()) || (row.medDesc.toLowerCase()).includes(this.state.search.toLowerCase()) || (row.longDesc.toLowerCase()).includes(this.state.search.toLowerCase()) || (row.brand.category.toLowerCase()).includes(this.state.search.toLowerCase())  
                   
                    
                })
            }
            return <ReactTable
            data={data}
            columns={this.state.columns}
            defaultPageSize={20}
          
           
            
        />
        }else{
            return <div className='loader-class'><div className="align-self-center loader">{this.state.loader ? <span><img src="img/loader.gif" /></span> : <span>No Offers Found.</span> }</div></div> 
        }
    }
}

    
onRowClick(){

}
toggleHandle(type){
    let columns = this.state.columns;
   this.setState({displayTable:false})
    switch(type){
        case '0':columns[0].show = !columns[0].show;
        break;
        case '1':columns[1].show = !columns[1].show;
        break;
        case '2':columns[2].show = !columns[2].show;
        break;
        case '3':columns[3].show = !columns[3].show;
        break;
        case '4':columns[4].show = !columns[4].show;
        break;
        case '5':columns[5].show = !columns[5].show;
        break;
        case '6':columns[6].show = !columns[6].show;
        break;
        case '7':columns[7].show = !columns[7].show;
        break;
        case '8':columns[8].show = !columns[8].show;
        break;
        case '9':columns[9].show = !columns[9].show;
        break;
        case '10':columns[10].show = !columns[10].show;
        break;
        case '11':columns[11].show = !columns[11].show;
        break;


    }
   
    this.setState({columns});
    setTimeout(()=>{
        this.setState({displayTable:true})
    },50)
 
}



  render() {
    
   
       
   
   return (
        <div className="animated fadeIn">
            <h3 className="title-margin-bottom">Offers Portfolio</h3>
            <Card className="card-border">
                <CardBody className="card-padding-top">
                <Dropdown className='pull-right' isOpen={this.state.dropdownOpen} toggle={() => {
                  this.toggle(0);
                }}>
                {/* <Dropdown isOpen={this.state.dropdownOpen} toggle={() => {
                  this.toggle(0);
                }}> */}
                  <DropdownToggle caret>
                  
                  <i className="fa fa-list fa-lg"></i>
                  </DropdownToggle>
                <span className='pull-right' style={{marginBottom:'20px'}}> <input value={this.state.search} placeholder='Search ...' className='form-control' onChange={e => this.setState({search: e.target.value})}/></span>
               
                  <DropdownMenu style={{width:'231px'}}>
                    <DropdownItem header>Columns</DropdownItem>
                    <DropdownItem disabled>Account Name  
                        <Label className="switch switch-sm switch-text switch-info float-right mb-0 right-align">
                            <Input type="checkbox" className='pull-right'  value={this.state.columns[0].show} onChange={()=>{this.toggleHandle('0')}} defaultChecked/>
                            {/* <span className="switch-label" data-on="On" data-off="Off"></span>
                            <span className="switch-handle"></span> */}
                        </Label>
                    </DropdownItem>
                    <DropdownItem disabled> Brand Name
                    <Label className="switch switch-sm switch-text switch-info float-right mb-0 right-align">
                            <Input type="checkbox" className='pull-right'  value={this.state.columns[1].show} onChange={()=>{this.toggleHandle('1')}} defaultChecked/>
                            {/* <span className="switch-label" data-on="On" data-off="Off"></span>
                            <span className="switch-handle"></span> */}
                        </Label>
                    </DropdownItem>
                    <DropdownItem disabled>Offer Desc.
                    <Label className="switch switch-sm switch-text switch-info float-right mb-0 right-align">
                            <Input type="checkbox"  className='pull-right' value={this.state.columns[2].show} onChange={()=>{this.toggleHandle('2')}} defaultChecked/>
                            {/* <span className="switch-label" data-on="On" data-off="Off"></span>
                            <span className="switch-handle"></span> */}
                        </Label>
                    </DropdownItem>                    
                    <DropdownItem disabled>Category 
                    <Label className="switch switch-sm switch-text switch-info float-right mb-0 right-align">
                            <Input type="checkbox" className='pull-right' value={this.state.columns[5].show} onChange={()=>{this.toggleHandle('5')}} defaultChecked/>
                            {/* <span className="switch-label" data-on="On" data-off="Off"></span>
                            <span className="switch-handle"></span> */}
                        </Label>
                    </DropdownItem>
                    <DropdownItem disabled>Start Date
                    <Label className="switch switch-sm switch-text switch-info float-right mb-0 right-align">
                            <Input type="checkbox" className='pull-right' value={this.state.columns[6].show} onChange={()=>{this.toggleHandle('6')}} defaultChecked/>
                            {/* <span className="switch-label" data-on="On" data-off="Off"></span>
                            <span className="switch-handle"></span> */}
                        </Label>
                    </DropdownItem>
                    <DropdownItem disabled>End Date
                    <Label className="switch switch-sm switch-text switch-info float-right mb-0 right-align">
                            <Input type="checkbox" className='pull-right' value={this.state.columns[7].show} onChange={()=>{this.toggleHandle('7')}} defaultChecked/>
                            {/* <span className="switch-label" data-on="On" data-off="Off"></span>
                            <span className="switch-handle"></span> */}
                        </Label>
                    </DropdownItem>
                    <DropdownItem disabled>Status
                    <Label className="switch switch-sm switch-text switch-info float-right mb-0 right-align">
                            <Input type="checkbox" className='pull-right' value={this.state.columns[8].show} onChange={()=>{this.toggleHandle('8')}} defaultChecked/>
                            {/* <span className="switch-label" data-on="On" data-off="Off"></span>
                            <span className="switch-handle"></span> */}
                        </Label>
                    </DropdownItem>
                    <DropdownItem disabled>No. of Outlets
                    <Label className="switch switch-sm switch-text switch-info float-right mb-0 right-align">
                            <Input type="checkbox" className='pull-right' value={this.state.columns[9].show} onChange={()=>{this.toggleHandle('9')}} defaultChecked/>
                            {/* <span className="switch-label" data-on="On" data-off="Off"></span>
                            <span className="switch-handle"></span> */}
                        </Label>
                    </DropdownItem>
                   
                    {/* <DropdownItem disabled>Redemption Url
                    <Label className="switch switch-sm switch-text switch-info float-right mb-0 right-align">
                            <Input type="checkbox" className='pull-right' value={this.state.columns[10].show} onChange={()=>{this.toggleHandle('1')}}/>
                        
                        </Label>
                    </DropdownItem> */}
                  </DropdownMenu>
                </Dropdown>
                {this.reactTable()}
                </CardBody>
            </Card>
          
         
         
         
       
        </div>
    )
  }
}

export default ManageOffers;
