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

import Popup from "reactjs-popup";

import { API_ROOT } from '../../api-config';
import axios from 'axios';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import AddBrand from './AddBrand'

import BrandDetail from './BrandDetail'



class ViewBrand extends Component {



  constructor() {
    super();
    this.state = {
       outletCount:5,
       addOutlet:false,
       brandProfile:false,
       brandID: '',
       brandName: '',
       Brands:[],
       brandUpdate: false,
       popupopen: false,
       search:'',
       currentPageToShow: 0
    };
    this.onRowClick = this.onRowClick.bind(this);
    this.brandBack = this.brandBack.bind(this);
    this.edit = this.edit.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }
  change(){
      this.setState({brandID: ""});
      this.setState({brandName: ""});
      this.setState({addOutlet:!this.state.addOutlet});
  }
  brandBack()
  {
    this.setState({addOutlet: false});
    this.setState({brandProfile: false});
  }
  edit()
  {
          this.setState({brandProfile: false});
          this.setState({brandUpdate: false});
          this.setState({addOutlet: true});
  }
  cardheader(){
      if(this.state.addOutlet){
            return  <CardHeader className='cardhead-main card-header-bg-white'>{this.state.brandName ? <span>{this.state.brandName}</span> : <span>Add Brand</span> }{this.props.match.params.msg == 'createbrand' ? <span></span> : <span><i className="icon-arrow-left-circle icons font-2xl float-right cursor-pointer" onClick={()=>this.change()}></i></span> }

            {this.state.brandName ? <span><i className="fa fa-trash icons pencil-top float-right cursor-pointer brand-edit-button" onClick={this.openModal} ></i><Popup
                      open={this.state.popupopen} 
                      onClose={this.closeModal} 
                      modal
                      closeOnDocumentClick
                      lockScroll={false}>
                      <div style={{color:'#111'}} className="modal">                      
                      <div className="header"> Close this Brand?</div>
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
                  </Popup></span> : <span></span> }

            </CardHeader>
      }
      else if(this.state.brandProfile)
        {
            return  <CardHeader className='cardhead-main card-header-bg-white'>
                   {this.state.brandName} <span><i className="icon-arrow-left-circle icons font-2xl float-right cursor-pointer" onClick={this.brandBack}></i>&nbsp;&nbsp;<i className="fa fa-pencil float-right pencil-top brand-edit-button" onClick={this.edit}></i></span>                   
          </CardHeader>
        }
      else{
          return  <span></span>
      }
  }
  getOutlets(){
    var auth = localStorage.getItem('auth');
    var that = this;
    var body = {};
    return  axios({
       method: 'get',
       url: API_ROOT+'api/brands/summary/'+that.props.match.params.merchantid,
       data: body,
       headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

     })
     .then(function (response) {
    that.setState({Brands:response.data})
       if(response.data.status == 'active'){
        
         
       }else{
         
       }
    
    
   })
   .catch(function (error) {
    
  
   }.bind(this)); 
  }



  brandrefresh()
  {
    var auth = localStorage.getItem('auth');
    var that = this;
    var body = {};

    return  axios({
       method: 'get',
       url: API_ROOT+'api/brands/summary/'+that.props.match.params.merchantid,
       data: body,
       headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

     })
     .then(function (response) {
    that.setState({Brands:response.data})
       if(response.data.status == 'active'){
        
         
       }else{
         
       }
    
    
   })
   .catch(function (error) {
    
  
   }.bind(this)); 
  }

    onRowClick(state, rowInfo, column, instance){
      return {
      onClick: e => {
       
        if(column.Header == "Name")
        {
           this.setState({brandProfile: true});
           this.setState({brandUpdate: false});
           this.setState({brandID: rowInfo.original.brandId});
           this.setState({brandName: rowInfo.original.brandName});
           this.setState({addOutlet: false});
        }

        if(column.Header == "")
        {
          this.setState({brandProfile: false});
          this.setState({brandUpdate: false});
           this.setState({brandID: rowInfo.original.brandId});
           this.setState({brandName: rowInfo.original.brandName});
           this.setState({addOutlet: true});
        }

          //const { history } = this.props;
            //      history.push('/base#brandId='+rowInfo.original.brandId);
        
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
        url: API_ROOT+'api/brands/closeBrandById?brandId='+that.state.brandID,
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}
 
      })
      .then(function (response) {

       if(response.status == 200){
        const { history } = that.props;
        history.push('/managemerchant/'+that.props.match.params.merchantid+'/2/branddelted');
        that.setState({addOutlet:false});
        that.setState({brandProfile:false});
         //close()
       }
    
     
     
    })
    .catch(function (error) {
     
     
    }.bind(this)); 
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

      const columns = [ {
          
        Header: 'S. No',
       show:true,
       id: "row",
       width: 50,
       Cell: (row) => {
        
        return <div>{row.index+1}</div>;
      }

      },
        {
        Header: 'Name',
        accessor: 'brandName' ,
        width: 350,
        tdProps:'rest'
      }, {
        Header: 'Market',
         Cell:prop=>{
         return 'India'
       }
        
      }, {
      
        Header: 'No Of Cities',
        accessor: 'cityCount',
      },{
        Header: 'No. of Outlets',
        accessor: 'outletCount',
        
      }, {
        Header: 'Category',
        accessor: 'category',
        
      }, 
      {
        Header: '', // Custom header components!
        filterable:false,
        width: 50,
        Cell:prop=>{
         return <i className="fa fa-edit fa-lg"></i>
       }
      }]

        if(this.state.addOutlet){
         
            return <AddBrand merchantId={this.props.merchantId} brandid={this.state.brandID} {...this.props}/>
        }else{
        
          if(this.state.brandProfile)
          {
           

            return <BrandDetail brandID={this.state.brandID} {...this.props}/>
          }
          else
          {


            var data1 = this.state.Brands;
         if(data1 != undefined){
          data1 = data1.filter(row => {
                 
            return row.brandName.toLowerCase().includes(this.state.search.toLowerCase()) || row.category.toLowerCase().includes(this.state.search.toLowerCase())
            
             
         })
         }
           

            return (
            <div>
            <div class="row" style={{marginBottom:'8px'}}>
              <div class="col-sm-12 col-lg-6"><table className="h-100">
  <tbody>
    <tr>
      <td class="align-bottom">{this.state.Brands.length > 1 ? <span>No. of brands: {this.state.Brands.length}</span> : <span>No. of brand: {this.state.Brands.length}</span>}</td>
    </tr>
  </tbody>
</table></div>
              <div class="col-sm-6 col-lg-3 text-right"><button type="button" class="btn btn-outline-primary" onClick={()=>this.change()}>Add Brand</button></div>
              <div class="col-sm-6 col-lg-3"><input value={this.state.search} placeholder='Search ...' className='form-control' onChange={e => this.setState({search: e.target.value})}/></div>
            </div>
             
            <ReactTable
            data={data1}
            columns={columns}
            defaultPageSize={20}
            getTdProps={this.onRowClick}
            page={this.state.currentPageToShow}
            onPageChange={pageIndex => this.setState({currentPageToShow: pageIndex})}
            onFetchData={(state, instance) => {
              //console.log(state.pageSize); 
              //console.log(state.page);
            }}
        />
        </div>
        )
          }
            
        }
  }



  componentDidMount()
  {
    this.getOutlets();
    if(this.props.match.params.msg == 'createbrand')
    {
      this.setState({addOutlet:true});
    }

    if(this.props.match.params.msg == 'brandupdated' || this.props.match.params.msg == 'brandadded')
    {
      this.setState({addOutlet:false});
      this.setState({brandProfile:false});
    }

    
  }


  componentWillReceiveProps(nextProps)
  {
    if(nextProps)
    {
      if(nextProps.match.params.msg == 'brandupdated' || nextProps.match.params.msg == 'brandadded')
      {
        this.setState({addOutlet:false});
        this.setState({brandProfile:false});
      }
      if(nextProps.match.params.msg == 'brandadded' || nextProps.match.params.msg == 'branddelted' || nextProps.match.params.msg == 'brandupdated')
      {
        this.brandrefresh();
      }

    }


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

export default ViewBrand;
