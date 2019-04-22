import React, { Component } from 'react';
import classnames from 'classnames';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Loader from 'react-loader-spinner'
import 'react-datepicker/dist/react-datepicker.css';
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
import Select from 'react-select';
import 'react-select/dist/react-select.css';


function validate(){

}




class Offer extends Component {



  constructor(props) {
    super(props);
      
          
            
        
    };
    offerRedeemOutlets(){
        var outlet_list = this.props.viewOffer.offerRedeemOutlets.map((outlet)=>{
            return <p className='margin-less' key={outlet.outletId}>{outlet.locationId}</p>
        })
        return outlet_list
    }
  
 

  componentDidMount(){
 
  }
  ifprops(){
    
      if(this.props.viewOffer.shortDesc){
          return <div className="animated fadeIn">
          <Card className='main-card-style'>
              
              <CardBody>
                  <FormGroup>
                    <Label  className='font-14'  style={{fontWeight:600}}>Offer Title</Label>
                    <p>{this.props.viewOffer.shortDesc}</p>
                </FormGroup>
                <FormGroup>
                    <Label  className='font-14'  style={{fontWeight:600}}>Offer Description</Label>
                    <p>{this.props.viewOffer.medDesc}</p>
                </FormGroup>
                <FormGroup>
                    <Label  className='font-14'  style={{fontWeight:600}}>Validity Period</Label>
                    <p>From : {this.props.viewOffer.valid_from.toString().split(' ')[0]}  </p>
                    <p>To: {this.props.viewOffer.valid_to.toString().split(' ')[0]}</p>
                </FormGroup>
                <FormGroup>
                    <Label  className='font-14'  style={{fontWeight:600}}>Promo Code</Label>
                    <p>{this.props.viewOffer.promoCode}</p>
                   
                </FormGroup>
                <FormGroup>
                    <Label  className='font-14'  style={{fontWeight:600}}>Remarks/Eligibility</Label>
                    <p>{this.props.viewOffer.eligibilityAndRemarks}</p>
                 
                </FormGroup>
                <FormGroup>
                    <Label  className='font-14'  style={{fontWeight:600}}>Redemption URL</Label>
                    <p>{this.props.viewOffer.redeemUrl}</p>
                 
                </FormGroup>
                <FormGroup>
                    <Label  className='font-14'  style={{fontWeight:600}}>Offer Redemption Outlets</Label>
                    {/* <p>{this.props.viewOffer.redeemUrl}</p> */}
                    {this.offerRedeemOutlets()}
                </FormGroup>
              </CardBody>
          </Card>
        
       
       
       
     
      </div>
      }else{
          return <div className='loader-class'><div className="align-self-center loader"><img src="img/loader.gif" /></div></div>
      }
  }
  
 


    




  render() {
   

   
   return (
        this.ifprops()
    )
}
  }


export default Offer;
