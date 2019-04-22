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
  


} from 'reactstrap';
import { API_ROOT } from '../../api-config';
import axios from 'axios';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
 import AddOffer from './OfferAdd.js'
 import Offer from './OfferDisplay.js'

import Popup from "reactjs-popup";



class ViewOffers extends Component {



  constructor(props) {
    super(props);
    this.onRowClick = this.onRowClick.bind(this);
    this.allOffers = this.allOffers.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.state = {
       offersCount:85,
       addOffer:false,
       Offers:[],
       search:'',
       viewOffer:{},
       Offer:false,
       offer_id: '',
       popupopen: false,
       currentPageToShow: 0
    };
  }
  change(key){
    if(key){
      if(key == 'singleOffer'){
        this.setState({addOffer:false})
        this.setState({Offer:false})
      }else if(key =='singleOfferEdit'){
        this.setState({addOffer:false})
        this.setState({Offer:false})
      }
      else if (key =='singleeditOffer'){
        this.setState({addOffer:true})
        this.setState({Offer:true})
      }
    }else{
      this.setState({addOffer:!this.state.addOffer})
      this.setState({Offer:false})
    }
     
  }
  getSingleOffer(key){
    var auth = localStorage.getItem('auth');

    var that = this;
   
    var body = {};
    return  axios({
       method: 'get',
       url: API_ROOT+'api/offers/' + key,
       data: body,
       headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

     })
     .then(function (response) {
     localStorage.setItem('auth', auth);
  
   
    that.setState({viewOffer:response.data});
    
    
   })
   .catch(function (error) {
    

   }.bind(this)); 
  }
  onRowClick(state, rowInfo, column, instance){
    return {
        onClick: e => {
         
            this.setState({Offer:true})
            this.setState({addOffer:false})
            this.getSingleOffer(rowInfo.original.offerId)
            this.setState({offer_id: rowInfo.original.offerId});

            
            
        }
    }
}
callApiAgain(){
  this.allOffers();
}
  cardheader(){
    if(this.state.addOffer && !this.state.Offer){
          return  <CardHeader className='cardhead-main card-header-bg-white'>Add Offers <span>
              {/* <Button color='success' className='pull-right back-button' onClick={()=>this.change()} >Back</Button> */}
              {this.props.match.params.msg == 'createoffer' ? <span></span> : <i className="icon-arrow-left-circle icons font-2xl float-right cursor-pointer"   onClick={()=>this.change()}></i> }
              </span></CardHeader>
    }else if(!this.state.addOffer && !this.state.Offer){
        return ( <span></span> )
    }else if (!this.state.addOffer && this.state.Offer){
      return  <CardHeader className='cardhead-main card-header-bg-white'>
                {this.state.viewOffer.longDesc} 
                <span>
                  {/* <Button color='success'  className='pull-right back-button' style={{marginLeft:'10px'}} onClick={()=>this.change('singleOffer')} >Back</Button>  */}
                  
                  <i className="icon-arrow-left-circle icons font-2xl float-right cursor-pointer" style={{marginLeft:'10px'}}  onClick={()=>this.change('singleOffer')}></i>
                  {/* <Button color='success'  className='pull-right back-button' onClick={()=>this.change('singleeditOffer')} >Edit <i className='fa fa-edit' style={{color:'white'}}></i></Button> */}
                  <i className="fa fa-pencil float-right pencil-top" onClick={()=>this.change('singleeditOffer')}></i>
                  
                </span>
               </CardHeader>
    }else if (this.state.addOffer && this.state.Offer){
      return  <CardHeader className='cardhead-main card-header-bg-white'>
      Edit Offers <span>
          {/* <Button color='success'  className='pull-right back-button' onClick={()=>this.change('singleOfferEdit')} >Back</Button> */}
          <i className="icon-arrow-left-circle icons font-2xl float-right cursor-pointer"   onClick={()=>this.change('singleOfferEdit')}></i>
          <i className="fa fa-trash icons pencil-top float-right cursor-pointer brand-edit-button delete-top" onClick={this.openModal} ></i>
          <Popup modal
                      closeOnDocumentClick
                      open={this.state.popupopen} 
                      onClose={this.closeModal}
                      lockScroll={false}>
                      <div style={{color:'#111'}} className="modal">                     
                      <div className="header"> Close this Offer?</div>
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
   isform(){
   
    
      const columns = [
        {
          Header: 'Brand Name',
          accessor: 'brandName' // String-based value accessors!
        }, 
        {
        Header: 'Offer Name',
        accessor: 'offerName' // String-based value accessors!
        }, 
      {
        Header: 'Status',
       accessor: 'status',
       Cell:props=>{
        return <Badge pill color={(props.value == 'active' || props.value == 'LIVE')?'green':'red'}   >{props.value} </Badge>
       },
        // Cell: props => <span style={{color:props.value == 'active' ? 'green'
        // : props.value == 'Scheduled' ? 'blue'
        // : 'red'}}>{props.value}</span> // Custom cell components!
      }, 
      {
       
        Header: 'No. of Outlets',
        accessor: 'outlets', // Custom value accessors!
        // Cell: props=>{
        //   var a = props.value // and to be replaced with pipe once api changes are made 
        //   return a.length
        // }
      }, 
      {
       
        Header: 'Start Date',
        accessor: 'validFrom',
        Cell: props => {
          
               return <span>{props.value.split(' ')[0]}</span> 
              //return <span>{props.value}</span>
            } 
            // Custom value accessors!
      },
      {
       
        Header: 'Expiry Date',
        accessor: 'validTo',// Custom value accessors!
        Cell: props => {
          
          return <span>{props.value.split(' ')[0]}</span> 
        
        } 
      },
        {
        Header: '', // Custom header components!
        filterable:false,
        Cell:prop=>{
          return <i className='fa fa-edit fa-lg'></i>
        },
        maxWidth:50
      }
    ]

        if(this.state.addOffer && !this.state.Offer){
            return <AddOffer msg={this.props.match.params.msg} {...this.props} allOffers={this.allOffers.bind(this)}  change = {this.change.bind(this)}/>
        }else if(!this.state.addOffer && !this.state.Offer){
          var data = this.state.Offers;
         if(data != undefined){
          data = data.filter(row => {
                 
            return row.offerName.toLowerCase().includes(this.state.search.toLowerCase()) || row.brandName.toLowerCase().includes(this.state.search.toLowerCase())
            
             
         })
         }
       
            return (<div>
              <div class="row" style={{marginBottom:'8px'}}>
              <div class="col-sm-12 col-lg-6"><table className="h-100">
  <tbody>
    <tr>
      <td class="align-bottom">{this.state.Offers.length > 1 ? <span>No. of offers: {this.state.Offers.length}</span> : <span>No. of offers: {this.state.Offers.length}</span>}</td>
    </tr>
  </tbody>
</table></div>
              <div class="col-sm-6 col-lg-3 text-right"><button type="button" class="btn btn-outline-primary" onClick={()=>this.change()}>Add Offer</button></div>
              <div class="col-sm-6 col-lg-3"><input value={this.state.search} placeholder='Search ...' className='form-control' onChange={e => this.setState({search: e.target.value})}/></div>
            </div>


              <ReactTable
            data={data}
            columns={columns}
              defaultPageSize={20}           
            getTrProps={this.onRowClick}
            page={this.state.currentPageToShow}
            onPageChange={pageIndex => this.setState({currentPageToShow: pageIndex})}
            onFetchData={(state, instance) => {
              //console.log(state.pageSize); 
              //console.log(state.page);
            }}
            
        /></div>)
        
   }
   else if (!this.state.addOffer && this.state.Offer){
      return <Offer viewOffer={this.state.viewOffer}></Offer>
   }
   else if (this.state.addOffer && this.state.Offer){
    return <AddOffer msg={this.props.match.params.msg} {...this.props}  viewOffer={this.state.viewOffer} allOffers={this.allOffers.bind(this)}  change = {this.change.bind(this)}/>
   }

  
  }
   allOffers(){
       var auth = localStorage.getItem('auth');
      
       var that = this;
       var merchantId =this.props.match.params.merchantid;
       var body = {};
       return  axios({
          method: 'get',
          url: API_ROOT+'/api/offers/summaryByMerchant?merchantId='+ that.props.match.params.merchantid,
          data: body,
          headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
       
    
       that.setState({Offers:response.data})
        
       
      })
      .catch(function (error) {
       
      
      }.bind(this)); 
   }
  componentDidMount()
  {
   
    this.allOffers();
    //this.setState({Offers:this.props.Offers})

    if(this.props.match.params.msg == 'createoffer'){
      this.setState({Offer:false})
      this.setState({addOffer:true})
    }

  }
  componentWillReceiveProps(nextProp){

    if(nextProp.match.params.msg == 'createoffer'){
      this.setState({Offer:false})
      this.setState({addOffer:true})
    }

    if(nextProp.match.params.msg == 'offerdeleted'){
      this.allOffers();
      this.setState({Offer:false})
      this.setState({addOffer:false})
    }

    if(nextProp.match.params.msg == 'offercreated'){
      this.setState({Offer:false});
      this.setState({addOffer:false});
      this.allOffers();
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
        url: API_ROOT+'api/offers/cancelOffer?offerId='+that.state.offer_id,
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}
 
      })
      .then(function (response) {
            
       if(response.status == 200){
       // this.setState({Offer:false});
      //this.setState({addOffer:false});
      
      const { history } = that.props;
      history.push('/managemerchant/'+that.props.match.params.merchantid+'/4/offerdeleted');
      that.allOffers();
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

export default ViewOffers;
