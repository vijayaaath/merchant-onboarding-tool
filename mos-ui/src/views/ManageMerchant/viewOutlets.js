import React, { Component } from 'react';
import classnames from 'classnames';
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

import Popup from "reactjs-popup";



class ViewOutlets extends Component {



  constructor(props) {
    super(props);
    this.onRowClick = this.onRowClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.state = {
       outletCount:5,
       addOutlet:false,
       Outlet:false,
       Outlets:[],
       viewOutlet:{},
        numberOfOutlets: '0',
       merchantID: '',
       outlet_id: '',
       popupopen: false,
       search: '',
       currentPageToShow: 0
     
    };
  }
  editableview(){
    this.setState({addOutlet:false});
    this.setState({Outlet:false})
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

            return  <CardHeader className='cardhead-main card-header-bg-white'><div>Add Outlets<i className="icon-arrow-left-circle icons font-2xl float-right cursor-pointer" onClick={()=>this.change()}></i></div></CardHeader>

      }else if(!this.state.addOutlet && !this.state.Outlet){
          return ( <span></span> )

      }
      else if (this.state.Outlet && !this.state.addOutlet){
        return  <CardHeader className='cardhead-main card-header-bg-white'>
                   {this.state.viewOutlet['locationId']} 
                   <span>

                   <i className="icon-arrow-left-circle icons font-2xl float-right cursor-pointer" onClick={()=>this.change('singleOutlet')}></i>&nbsp;&nbsp;<i className="fa fa-pencil float-right pencil-top brand-edit-button" onClick={()=>this.change('editOutlet')}></i>
                    </span>
          </CardHeader>
      }
      else if (this.state.addOutlet && this.state.Outlet){
        return <CardHeader className='cardhead-main card-header-bg-white'>

                   Edit Outlet <span><i className="icon-arrow-left-circle icons font-2xl float-right cursor-pointer" onClick={()=>this.change('singleOutletedit')} ></i><i className="fa fa-trash icons pencil-top float-right cursor-pointer brand-edit-button" onClick={this.openModal} ></i>
                    <Popup modal
                      closeOnDocumentClick
                      open={this.state.popupopen} 
                      onClose={this.closeModal}
                      lockScroll={false}>
                      <div style={{color:'#111'}} className="modal">                      
                      <div className="header"> Close this Outlet?</div>
                        {/* <p>This will terminate this outlet</p> */}
                        <div className="content">
                        <p>You cannot undo this action. Delete it?</p>
                        </div>
                        <div className="actions">
                        <button
                          className="button close-button"
                          onClick={this.closeBrand.bind(this)}
                        >
                         Ok
                        </button>
                        <button
                          className="button cancel-button"
                          style={{marginLeft:'20px'}}
                          onClick={this.closeModal}
                        >
                         Cancel
                        </button>
                        </div>
                      </div>
                  </Popup>
                   </span>

          </CardHeader>
      }
  }
  onRowClick(state, rowInfo, column, instance){
    return {
        onClick: e => {
          this.getOutletSingle(rowInfo.original.outletId)
          
          this.setState({outlet_id: rowInfo.original.outletId});
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
    var body = {};
    return  axios({
       method: 'get',
        url: API_ROOT+'/api/outlets/summaryByMerchant?merchantId='+that.props.match.params.merchantid,
       data: body,
       headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

     })
     .then(function (response) {
     that.setState({Outlets:response.data});
    that.setState({numberOfOutlets:response.data.length});
    
    
   })
   .catch(function (error) {
    
    
   }.bind(this)); 
  }
  handleClickOutlets(e){
  
  }
  isform(){
    const data = [
        {
            name: 'Tanner Linsley',
            city:'Chennai',
            active_offers:3
        },
        {
            name: 'Linsley',
            city:'Brisbane',
            active_offers:9
        },
        {
            name: 'Tanner',
            city:'New York',
            active_offers:11
        },
        {
            name: 'Panner Linsley',
            city:'Delhi',
            active_offers:1
        },
        {
            name: 'yi',
            city:'Mumbai',
            active_offers:31
        },
    ]

      const columns = [{
      Header: 'Brand name',
        accessor: 'brandName' 
       
      },
      {
        Header: 'Name',
        accessor: 'locationId' 
       
      },    
       {
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
          return <i className='fa fa-edit fa-lg '></i>
        },
        maxWidth:50
      }]
        if(this.state.addOutlet && !this.state.Outlet){
            return <AddOutletForm getOutlets={this.getOutlets.bind(this)} change={this.change.bind(this)} {...this.props}/>
        }else if(!this.state.addOutlet && !this.state.Outlet){


            var data1 = this.state.Outlets;
         if(data1 != undefined){
          data1 = data1.filter(row => {
                 
            return row.locationId.toLowerCase().includes(this.state.search.toLowerCase()) || row.brandName.toLowerCase().includes(this.state.search.toLowerCase()) || row.city.toLowerCase().includes(this.state.search.toLowerCase())
            
             
         })
         }


            return (
              <div>
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
            data={data1}
            columns={columns}
              defaultPageSize={20}         
            getTrProps={this.onRowClick}
            page={this.state.currentPageToShow}
            onPageChange={pageIndex => this.setState({currentPageToShow: pageIndex})}
            onFetchData={(state, instance) => {
              //console.log(state.pageSize); 
              //console.log(state.page);
            }}
            
        />
        </div>
        )
        }else if(!this.state.addOutlet && this.state.Outlet){
          return <Outlet viewOutlet={this.state.viewOutlet}></Outlet>
        }else if (this.state.addOutlet && this.state.Outlet){
          return <AddOutletForm getOutlets={this.getOutlets.bind(this)} change={this.change.bind(this)} sendData={this.state.viewOutlet} {...this.props}/>
        }
  }
 

  componentDidMount()
  {
    this.getOutlets();
     this.setState({merchantID: this.props.match.params.merchantid});
     if(this.props.match.params.msg == 'createoutlet')
     {
        this.setState({addOutlet: true});
        this.setState({Outlet: false});
     }
  }
  componentWillReceiveProps(nextProps){

    if(nextProps.match.params.msg == 'outletcreated')
     {
        this.getOutlets();
     }

      if(nextProps.match.params.msg == 'outletdeleted')
     {
        this.setState({addOutlet: false});
        this.setState({Outlet: false});
        this.getOutlets();
     }

     if(nextProps.match.params.msg == 'outletupdated')
     {
        if(this.state.outlet_id != '')
        {
          this.getOutletSingle(this.state.outlet_id);
        }
           
     }

  }

 
popupDeleteBrand(){
    // this is for the modal popup 

    
  }

closeBrand(){
    ///api/offers/closeBrandByName?brandName
   
    var auth = localStorage.getItem('auth');
   
     var that = this;
    
     var body = {};
     return  axios({
        method: 'get',
        url: API_ROOT+'api/outlets/closeOutlet?outletId='+that.state.outlet_id,
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}
 
      })
      .then(function (response) {

       if(response.status == 200){
        const { history } = that.props;
        history.push('/managemerchant/'+that.props.match.params.merchantid+'/3/outletdeleted');
         //close()
       }
    
     
     
    })
    .catch(function (error) {
     
     
    }.bind(this)); 
}


 closeModal(){
    this.setState({ popupopen: false });
  }

  openModal(){
    this.setState({ popupopen: true });
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
