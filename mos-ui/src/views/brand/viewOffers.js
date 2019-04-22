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
import AddOffer from './addOffer'
import Offer from './Offer'



class ViewOffers extends Component {



  constructor(props) {
    super(props);
    this.onRowClick = this.onRowClick.bind(this)
    this.state = {
       offersCount:85,
       addOffer:false,
       search:'',
       Offers:[],
       viewOffer:{},
       Offer:false
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
  
   
    that.setState({viewOffer:response.data})
    
    
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

            
            
        }
    }
}
callApiAgain(){
  this.allOffers();
}
  cardheader(){
    if(this.state.addOffer && !this.state.Offer){
          return  <CardHeader className='cardhead-main card-header-bg-white'>Add Offers <span><i className="icon-arrow-left-circle icons font-2xl float-right cursor-pointer"  onClick={()=>this.change()}></i></span></CardHeader>
    }else if(!this.state.addOffer && !this.state.Offer){
        return  <span></span>
    }else if (!this.state.addOffer && this.state.Offer){
      return  <CardHeader className='cardhead-main card-header-bg-white'>
                {this.state.viewOffer.longDesc} 
                <span>
                  {/* <Button color='success'  className='pull-right back-button' style={{marginLeft:'10px'}} onClick={()=>this.change('singleOffer')} >Back</Button>  */}
                  <i className="icon-arrow-left-circle icons font-2xl float-right cursor-pointer"  onClick={()=>this.change('singleOffer')}></i>
                  {/* <Button color='success'  className='pull-right back-button' onClick={()=>this.change('singleeditOffer')} >Edit <i className='fa fa-edit' style={{color:'white'}}></i></Button> */}
                </span>
               </CardHeader>
    }else if (this.state.addOffer && this.state.Offer){
      return  <CardHeader className='cardhead-main card-header-bg-white'>
      Edit Offers <span><i className="icon-arrow-left-circle icons font-2xl float-right cursor-pointer" onClick={()=>this.change('singleOfferEdit')}></i></span>
</CardHeader>
    }
}
   isform(){
   
    
      const columns = [{
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
      // {
       
      //   Header: 'No. of Outlets',
      //   accessor: 'offerRedeemOutlets', // Custom value accessors!
      //   Cell: props=>{
      //     var a = props.value // and to be replaced with pipe once api changes are made 
      //     return a.length
      //   }
      // }, 
      {
       
        Header: 'Start Date',
        accessor: 'validFrom',
        Cell: props => {
          
              return <span>{props.value.split(' ')[0]}</span> 
            
            } // Custom value accessors!
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
            return <AddOffer Outlets={this.props.Outlets} allOffers={this.allOffers.bind(this)}  change = {this.change.bind(this)}/>
        }else if(!this.state.addOffer && !this.state.Offer){
          var data = this.state.Offers
          data = data.filter(row => {
                 
           return row.offerName.toLowerCase().includes(this.state.search.toLowerCase())
           
            
        })
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
        /></div>)
        
   }
   else if (!this.state.addOffer && this.state.Offer){
      return <Offer viewOffer={this.state.viewOffer}></Offer>
   }
   else if (this.state.addOffer && this.state.Offer){
    return <AddOffer Outlets={this.props.Outlets} viewOffer={this.state.viewOffer} allOffers={this.allOffers.bind(this)}  change = {this.change.bind(this)}/>
   }

  
  }
   allOffers(){
       var auth = localStorage.getItem('auth');
   
       var that = this;
       var brandId = window.location.href.split('#brandId=')[1];
       var body = {};
       return  axios({
          method: 'get',
          url: API_ROOT+'api/offers/',
          data: body,
          headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
        localStorage.setItem('auth', auth);
    
        var offers = [];
        for(var a = 0;a<response.data.length;a++){
          if(window.location.href.split('#brandId=')[1] == response.data[a].brand.brandId){
            offers.push(response.data[a])
          }
        }
       that.setState({Offers:offers})
          if(response.data.status == 'active'){
           
            
          }else{
            
          }
       
       
      })
      .catch(function (error) {
       
   
      }.bind(this)); 
   }
  componentDidMount()
  {
   
    //this.allOffers();
    this.setState({Offers:this.props.Offers})

  }
  componentWillReceiveProps(nextProp){
 
    this.setState({Offers:this.props.Offers})
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
