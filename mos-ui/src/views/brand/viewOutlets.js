import React, { Component } from 'react';
import classnames from 'classnames';
import Popup from "reactjs-popup";
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
  Table,
  Pagination,
  PaginationItem,
  PaginationLink


} from 'reactstrap';

import { API_ROOT } from '../../api-config';
import axios from 'axios';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import AddOutletForm from './addOutlet'
import Outlet from './Outlet'



class ViewOutlets extends Component {



  constructor(props) {
    super(props);
    this.onRowClick = this.onRowClick.bind(this)
    this.state = {
       outletCount:5,
       addOutlet:false,
       Outlet:false,
       Outlets:[],
       search:'',
       viewOutlet:{},
       POPUP:false
     
    };
  }
  editableview(){
    this.setState({addOutlet:false});
    this.setState({Outlet:false})
  }
  deleteOutlet(){
   
   // /api/offers/closeOutletByBrandName?outletName=''&brandName=''
   this.setState({POPUP:false})
   var auth = localStorage.getItem('auth');
  
    var that = this;
   
    var body = {};
    return  axios({
       method: 'get',
       url: API_ROOT+'api/outlets/closeOutletByBrandName?outletName='+ this.state.viewOutlet.uniqOutletQualities+'&brandName='+this.state.viewOutlet.brandName,
       data: body,
       headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

     })
     .then(function (response) {
   
    
     
      if(response.status == 200){
        location.reload();
      }
      //that.setState({viewOutlet:response.data})
    
    
   })
   .catch(function (error) {
    
    
   }.bind(this)); 


  }
  change(key){
        if(key){
          if(key== 'TABLE_PAGE'){
            this.setState({addOutlet:false})
          }
          else if (key == 'singleOutlet'){
            this.setState({Outlet:false})
          }
          else if (key == 'singleOutletedit'){
            this.setState({addOutlet:false})
            this.setState({Outlet:false})
          }
          else if (key == 'editOutlet'){
            this.setState({addOutlet:true})
            this.setState({Outlet:true})
          }
         
        }else{
          this.setState({addOutlet:!this.state.addOutlet})
        }
     
  }
  cardheader(){
      if(this.state.addOutlet && !this.state.Outlet){
      
            return  <CardHeader className='cardhead-main card-header-bg-white'>
                      <div>Add Outlets
                        {/* <Button color='success' className='pull-right back-button' onClick={()=>this.change()} >Back</Button> */}
                        <i className="icon-arrow-left-circle icons font-2xl float-right cursor-pointer" onClick={()=>this.change()}></i>
                      </div>
                    </CardHeader>
      }else if(!this.state.addOutlet && !this.state.Outlet){
      
          return  <span></span>
      }
      else if (this.state.Outlet && !this.state.addOutlet){
     
        return  <CardHeader className='cardhead-main card-header-bg-white'>
                   {this.state.viewOutlet['locationId']} 
                   <span>
                     {/* <Button color='success' id='back-button-id' style={{marginLeft:'10px'}} onClick={()=>this.change('singleOutlet')} className='pull-right back-button'>Back</Button>
                     <Button color='success' id='back-button-id'  onClick={()=>this.change('editOutlet')} className='pull-right back-button'>Edit <i className='fa fa-edit' style={{color:'white'}}></i></Button> */}
                      <i className="icon-arrow-left-circle icons font-2xl float-right cursor-pointer" style={{marginLeft:'10px'}} onClick={()=>this.change('singleOutlet')}></i>
                      <i className="fa fa-pencil float-right pencil-top" onClick={()=>this.change('editOutlet')}></i>
                    </span>
          </CardHeader>
      }
      else if (this.state.addOutlet && this.state.Outlet){
    
        return <CardHeader className='cardhead-main card-header-bg-white'>
                   Edit Outlet <span>
                     {/* <Button color='success' id='back-button-id'  style={{marginLeft:'10px'}} onClick={()=>this.change('singleOutletedit')} className='pull-right back-button'>Back</Button> */}
                     <i className="icon-arrow-left-circle icons font-2xl float-right cursor-pointer" style={{marginLeft:'10px'}} onClick={()=>this.change()}></i>
                    
                     {/* <Button color='success' id='back-button-id'  className='pull-right back-button'>Close Outlet</Button> */}
                     {/* <i className="fa fa-trash icons font-2xl float-right cursor-pointer" ></i> */}
                     </span>
                     <Popup trigger={ <i className="fa fa-trash icons font-2xl float-right cursor-pointer" ></i>} modal
                      closeOnDocumentClick
                      open={this.state.POPUP}
                      // onOpen = {this.setState({POPUP:true})}
                      // onClose = {this.setState({POPUP:false})}
                      >
                       {close => (
                      <div style={{color:'#111'}} className="modal">
                      {/* <a className="close" onClick={close}>
                        &times;
                      </a> */}
                      <div className="header"> Close this outlet?</div>
                        {/* <p>This will terminate this outlet</p> */}
                        <div className="content">
                        <p>You cannot undo this action. Delete it?</p>
                        </div>
                        <div className="actions">
                        <button
                          className="button close-button"
                          onClick={()=>{this.deleteOutlet();setTimeout(()=>{
                            close()
                          },500)}}
                          
                        >
                         Ok
                        </button>
                        <button
                          className="button cancel-button"
                          style={{marginLeft:'20px'}}
                          onClick={() => {
                          
                            close()
                          }}
                        >
                         Cancel
                        </button>
                        </div>
                      </div>
                        )}
                    </Popup>
          </CardHeader>
      }
  }
  onRowClick(state, rowInfo, column, instance){
    return {
        onClick: e => {
          this.getOutletSingle(rowInfo.original.outletId)
         

            this.setState({Outlet:true})
            this.setState({addOutlet:false})

            
            
        }
    }
}
getOutletSingle(id){
  var auth = localStorage.getItem('auth');
  
    var that = this;
   
    var body = {};
    return  axios({
       method: 'get',
       url: API_ROOT+'api/outlets/'+ id,
       data: body,
       headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

     })
     .then(function (response) {
   
    
  
      that.setState({viewOutlet:response.data})
    
    
   })
   .catch(function (error) {
    
    
   }.bind(this)); 
}
  getOutlets(){
    var auth = localStorage.getItem('auth');
   
    var that = this;
    var brandName= window.location.href.split('#brandName=')[1];
    var body = {};
    return  axios({
       method: 'get',
       url: API_ROOT+'api/outlets/summaryByBrandName?name='+ brandName,
       data: body,
       headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

     })
     .then(function (response) {
     localStorage.setItem('auth', auth);
    
    that.setState({Outlets:response.data})
       if(response.data.status == 'active'){
        
         
       }else{
         
       }
    
    
   })
   .catch(function (error) {
    
   
   }.bind(this)); 
  }
  handleClickOutlets(e){
   
  }
  isform(){
    const columns = [{
        Header: 'Name',
        accessor: 'locationId' 
       
      }, {
        Header: 'City',
        accessor: 'city',
        
      }, {
      
        Header: 'Active offers',
       accessor:'offerCount'
      }, 
      {
        Header: '', // Custom header components!
        filterable:false,
        Cell:prop=>{
          return <i className='fa fa-edit fa-lg'></i>
        },
        maxWidth:50
      }]
        if(this.state.addOutlet && !this.state.Outlet){
            return <AddOutletForm getOutlets={this.getOutlets.bind(this)} change={this.change.bind(this)}/>
        }else if(!this.state.addOutlet && !this.state.Outlet){
          var data = this.state.Outlets;
          data = data.filter(row => {
                 
            return row.locationId.toLowerCase().includes(this.state.search.toLowerCase()) ||  String(row.offerCount).includes(this.state.search)
            
             
         })
            return <div>
              
<div class="row" style={{marginBottom:'8px'}}>
              <div class="col-sm-12 col-lg-6"><table className="h-100">
  <tbody>
    <tr>
      <td class="align-bottom">{this.state.numberOfOutlets > 1 ? <span>No. of outlets: {this.state.numberOfOutlets}</span> : <span>No. of outlets: {this.state.numberOfOutlets}</span>}</td>
    </tr>
  </tbody>
</table></div>
              <div class="col-sm-6 col-lg-3 text-right"><button type="button" class="btn btn-outline-primary" onClick={()=>this.change()}>Add Outlet</button></div>
              <div class="col-sm-6 col-lg-3"><input value={this.state.search} placeholder='Search ...' className='form-control' onChange={e => this.setState({search: e.target.value})}/></div>
            </div>


              <ReactTable
            data={data}
            columns={columns}
            defaultPageSize={20}
          
            getTrProps={this.onRowClick}
            
        /></div>
        }else if(!this.state.addOutlet && this.state.Outlet){
          return <Outlet viewOutlet={this.state.viewOutlet}></Outlet>
        }else if (this.state.addOutlet && this.state.Outlet){
          return <AddOutletForm getOutlets={this.getOutlets.bind(this)} change={this.change.bind(this)} sendData={this.state.viewOutlet}/>
        }
  }
 

  componentDidMount()
  {
    //this.getOutlets();
    this.setState({Outlets:this.props.Outlets})
  }
  componentWillReceiveProps(nextProp){
    this.setState({Outlets:this.props.Outlets})
    
    // if(this.prop != nextProp){
     
    // }
  }

 



  render() {

   
    
    // data table configs

    



    return (
        <div className="animated fadeIn">
           
          
          
          
          {/* <Col xs="12" sm="12" md="12"> */}
          <Card className='main-card-style'>
         
              
                {this.cardheader()}
              <CardBody>
              {this.isform()}
              </CardBody>
            </Card>
          {/* </Col> */}
         
         
        
        </div>
    )
  }
}

export default ViewOutlets;
