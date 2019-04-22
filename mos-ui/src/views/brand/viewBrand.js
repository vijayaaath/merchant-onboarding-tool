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
  


} from 'reactstrap';
import { API_ROOT } from '../../api-config';
import axios from 'axios';
 import Widget04 from '../Dashboard/Widget04'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import EditBrand from './EditBrand'




class ViewBrand extends Component {



  constructor(props) {
    super(props);
   // this.edit = this.edit.bind(this)
//    this.props = {
//     //jsonBrandProfile
//    }
this.viewBRAND = this.viewBRAND.bind(this)
this.toggle = this.toggle.bind(this)
    this.state = {
        
            websiteEdit:false,
            business_category:false,
            sub_category:false,
            description:false,
            business_tags:false,
            Active:'Active',
            no_image:'img/no_image.jpg',
            tags:[],
            brandprofileisopen:true,
            fields:[
                {},

            ],
            jsonBrandProfile:{
                
            }
            //jsonBrandProfile:{}
        
    };
  }
  
  popupDeleteBrand(){
    // this is for the modal popup 

    
  }
  toggle(){
    this.setState({brandprofileisopen:!this.state.brandprofileisopen})
  }
  componentWillReceiveProps(nextProps){
      if(this.props != nextProps){
        let jsonBrandProfile = this.props.jsonBrandProfile;
        this.setState({jsonBrandProfile});
         if(this.props.jsonBrandProfile.tagsList){
             var tag_local = this.props.jsonBrandProfile.tagsList;
              this.setState({tags:tag_local})
           
         }
      }
  
    
  }
  componentDidMount()
  {
    let jsonBrandProfile = this.props.jsonBrandProfile;
    this.setState({jsonBrandProfile});
    if(this.props.jsonBrandProfile.tagsList){
        var tag_local = this.props.jsonBrandProfile.tagsList;
         this.setState({tags:tag_local})
      
    }
  
    
      
  }
  sendapi(i){
    //api/brands/{id}
    var auth = localStorage.getItem('auth');
    var brandId = window.location.href.split('#brandId=')[1] || '1';
  
    var that = this;
    var body = this.state.jsonBrandProfile;
    return  axios({
       method: 'patch',
       url: API_ROOT+'api/brands/'+ brandId,
       data: body,
       headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

     })
     .then(function (response) {
     localStorage.setItem('auth', auth);
   
    
       if(response.status == 200){
        that.edit(i)
         
       }else{
         
       }
    
    
   })
   .catch(function (error) {
    
   
   }.bind(this)); 
  
   
  }
  cancelupdate(i){
      let jsonBrandProfile = this.props.jsonBrandProfile;
    
      this.setState({jsonBrandProfile})
      this.edit(i)
  }
  changeHandle(field,e){
      let jsonBrandProfile  = this.state.jsonBrandProfile;
        jsonBrandProfile[field] = e.target.value;
      
      this.setState({jsonBrandProfile})

  }
  
  website(){
      if(this.state.websiteEdit){
        return <Input type="text" id="url" name="url" placeholder="Enter Website URL" value={this.state.jsonBrandProfile.url} onChange={this.changeHandle.bind(this,'url')}/>
      }else{
             return  <p>{this.state.jsonBrandProfile.url}</p>
      }
  }
  website_edit_button(){
    if(!this.state.websiteEdit){
        return <i className="fa fa-edit fa-lg mt-4 font-14" onClick={() => { this.edit('1'); }}></i>
      }else{
             return  (<span><i className="fa fa-check fa-lg mt-4 font-14" onClick={() => { this.sendapi('1'); }}></i>
             <i className="fa fa-close fa-lg mt-4 font-14" onClick={() => { this.cancelupdate('1'); }}></i></span>)
      }
  }
  businessCategory(){
      if(this.state.business_category){
          return <Input type="text" id="category" name="category" placeholder="Enter the Business Category" value={this.state.jsonBrandProfile.category} onChange={this.changeHandle.bind(this,'category')}/>
      }else{
          return <p>{this.state.jsonBrandProfile.category}</p>
      }
  }
  businessCategory_edit_button(){
    if(!this.state.business_category){
        return <i className="fa fa-edit fa-lg mt-4 font-14" onClick={() => { this.edit('3'); }}></i>
      }else{
             return  (<span><i className="fa fa-check fa-lg mt-4 font-14" onClick={() => { this.sendapi('3'); }}></i>
             <i className="fa fa-close fa-lg mt-4 font-14" onClick={() => { this.cancelupdate('3'); }}></i></span>)
      }
  }
  
  subCategory(){
    if(this.state.sub_category){
        return <Input type="text" id="subCategories" name="subCategories" placeholder="Enter the Sub Category" value={this.state.jsonBrandProfile.subCategories} onChange={this.changeHandle.bind(this,'subCategories')}/>
    }else{
        return  <p>{this.props.jsonBrandProfile.subCategories}</p>
    }
  }
  subCategory_edit_button(){
    if(!this.state.sub_category){
        return <i className="fa fa-edit fa-lg mt-4 font-14" onClick={() => { this.edit('4'); }}></i>
      }else{
             return  (<span><i className="fa fa-check fa-lg mt-4 font-14" onClick={() => { this.sendapi('4'); }}></i>
             <i className="fa fa-close fa-lg mt-4 font-14" onClick={() => { this.cancelupdate('4'); }}></i></span>)
      }
  }
  description(){
    if(this.state.description){
        return <Input type="textarea" id="description" name="description" placeholder="Enter the Description" value={this.state.jsonBrandProfile.description} onChange={this.changeHandle.bind(this,'description')}/>
    }else{
        return <p>{this.props.jsonBrandProfile.description}</p>
    }
}
description_edit_button(){
    if(!this.state.description){
        return <i className="fa fa-edit fa-lg mt-4 font-14" onClick={() => { this.edit('5'); }}></i>
      }else{
             return  (<span><i className="fa fa-check fa-lg mt-4 font-14" onClick={() => { this.sendapi('5'); }}></i>
             <i className="fa fa-close fa-lg mt-4 font-14" onClick={() => { this.cancelupdate('5'); }}></i></span>)
      }
}
businessTags(){
    if(this.state.business_tags){
        return <Input type="textarea" id="business_tags" name="business_tags" placeholder="Enter the Business Tags"/>
    }else{
       
            var tag_locals = []
          
            for (var a =0;a<this.state.tags.length;a++){
                tag_locals.push(<Badge pill color='primary' key={a} style={{marginRight:5+'px'}} >{this.state.tags[a]} </Badge> )
            }
            return (
                <p>{tag_locals}</p>
              );
            
     
        
        
        
    }
}
businessTags_edit_button(){
    // if(!this.state.business_tags){
    //     return <i className="fa fa-edit fa-lg mt-4 font-14" onClick={() => { this.edit('6'); }}></i>
    //   }else{
    //          return  (<span><i className="fa fa-check fa-lg mt-4 font-14" onClick={() => { this.sendapi('6'); }}></i>
    //          <i className="fa fa-close fa-lg mt-4 font-14" onClick={() => { this.cancelupdate('6'); }}></i></span>)
    //   }
    return ''
}
closeBrand(){
    ///api/offers/closeBrandByName?brandName
   
   
    var auth = localStorage.getItem('auth');
   
     var that = this;
    
     var body = {};
     return  axios({
        method: 'get',
        url: API_ROOT+'api/offers/closeBrandByName?brandName='+ window.location.href.split('#brandName=')[1],
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}
 
      })
      .then(function (response) {
    
     
    
       if(response.status == 200){
         location.reload();
         //close()
       }
    
     
     
    })
    .catch(function (error) {
     
     
    }.bind(this)); 
}
makeimages(){
    if(this.props.jsonBrandProfile.imageResponse){

    
    if(this.props.jsonBrandProfile.imageResponse.length> 0){
            for(var a=0;a<this.props.jsonBrandProfile.imageResponse.length;i++){
                return(<Col xs='12' sm='12' md='4'>
                <div className='image-cards' >
                    <img src={this.props.jsonBrandProfile.imageResponse[a].image} className='image_style'/>
                </div>
            </Col>)
            }
    }else{
        return(
       
        
        <Col xs='12' sm='12' md='4'>
                            <div className='image-cards' >
                                <img src={this.state.no_image} className='image_style'/>
                            </div>
                        </Col>
        )
       
    }
}
   
}
countryCityMap(){
    
    for(var key in this.props.totalBrandInfo.countryCityMap){
        return <p style = {{textTransform:'capitalize'}}>{key}: {this.props.totalBrandInfo.countryCityMap[key]}</p>
    }
    
}
viewBRAND(){
    if(this.state.brandprofileisopen){
        return <CardBody>
        <Row>
            <Col xs='12' sm='6' md='6'>
            <Label className='boldhead'>Business Category  </Label>
                
                {this.businessCategory()}                
            </Col>
            <Col xs='12' sm='6' md='6' >
                <div className='pull-right'>
                <Label className='boldhead'>Status  </Label>:  
                <span className='textCapitalize' style={{color:this.props.jsonBrandProfile.status == 'active'?'green':'red'}}> {this.props.jsonBrandProfile.status} 
                {/* <i className="fa fa-edit fa-lg mt-4" style={{color:'black'}} onClick={() => { this.edit('2'); }}></i> */}
                </span>
                </div>
            </Col>

        </Row>
       
        <Row>
        <Col xs='12' sm='12' md='12'>
                <Label className='boldhead'>Sub Categories </Label>
                {this.subCategory()}
        </Col>
        </Row>
        <Row>
        <Col xs='12' sm='12' md='12'>
                <Label className='boldhead'>Description </Label>
                {this.description()}
        </Col>
        </Row>
        <Row>
        <Col xs='12' sm='12' md='12'>
                <Label className='boldhead'>Business Highlights(Tags)  </Label>
                {this.businessTags()}
        </Col>
        </Row>
        <Row>
        <Col xs='12' sm='12' md='12'>
        <Label className='boldhead'>Store   </Label>
           <p> {this.props.jsonBrandProfile.stores}</p>
        </Col>
        </Row>
        
        <Row>
        <Col xs='12' sm='12' md='12'>
        <Label className='boldhead'>Website   </Label>
                {this.website()}
        </Col>
        </Row>

        <Row>
        <Col xs='12' sm='12' md='12' style={{marginBottom:15+'px'}}>
                <Label className='boldhead' style={{display:'block'}}>Promote brand to web even without offers?</Label>
                {/* <FormGroup check className="checkbox"> */}
                {/* <Input className="form-check-input" type="radio" id="checkbox1" name="checkbox1"  /> */}
                <Label check className="form-check-label" htmlFor="checkbox1">Yes</Label>
              {/* </FormGroup> */}
              {/* <FormGroup check className="checkbox">
                <Input className="form-check-input" type="radio" id="checkbox2" name="checkbox1"  />
                <Label check className="form-check-label" htmlFor="checkbox1">No</Label>
              </FormGroup> */}
        </Col>
        </Row>
        <Row>
        <Col xs='12' sm='12' md='12'>
                <Label className='boldhead'>Brand Images  </Label>
                <Row>
                {this.makeimages()}
                </Row>
        </Col>
        <div className='gray-back'>
        <Col xs='12' sm='12' md='12' style={{marginTop:20+'px'}}>
                
                
                <Row>
                    <Col xs="12" lg="4" sm="12" md="4">
                        <Widget04 icon="" color="#56bddb" className="bg-main" header={this.props.totalBrandInfo.outletCount || 0} value="31">Outlet Count</Widget04>
                    </Col>
                    <Col xs="12" lg="4" sm="12" md="4">
                        <Widget04 icon="" color="#fec10f" className="bg-second" header={this.props.totalBrandInfo.activeOfferCount || 0} value="31">Active Offers</Widget04>
                    </Col>
                    <Col xs="12" lg="4" sm="12" md="4">
                        <Widget04 icon="" color="#a9d18e" className="bg-third" header={this.props.totalBrandInfo.pendingOfferCount || 0} value="31">Pending Offers</Widget04>
                    </Col>
                </Row>
        </Col>
        <Col xs='12' sm='12' md='12'>
            <Label className='boldhead'> Markets</Label>
           
           {this.countryCityMap()}

           
            
        </Col>
        </div>
        </Row>
      </CardBody>
    }else{
        return <CardBody><EditBrand brandData={this.state.jsonBrandProfile}/></CardBody>
    }
}
cardHEADER(){
    if(this.state.brandprofileisopen){
        return <CardHeader className='cardhead-main card-header-bg-white'>
              <div className="row">
                <div className="col">
                  <i className="fa fa-pencil float-right pencil-top" onClick={this.toggle}></i>
                </div>
              </div>
           
       
  </CardHeader>
    }else{
        return <CardHeader className='cardhead-main card-header-bg-white'>
       Edit Brand
        <span>
            {/* <Button color='success' style={{marginLeft:'10px'}} className='pull-right back-button'  onClick={this.toggle}>Back</Button> */}
            <i className="icon-arrow-left-circle icons font-2xl float-right cursor-pointer" style={{marginLeft:'10px'}} onClick={this.toggle}></i>
            {/* <Button color='danger' className='pull-right back-button' onClick={()=>this.popupDeleteBrand()} >Close Brand</Button> */}
            {/* <i className="fa fa-trash icons font-2xl float-right cursor-pointer" onClick={()=>this.popupDeleteBrand()}></i> */}
        </span>
        <Popup trigger={ <i className="fa fa-trash icons font-2xl float-right cursor-pointer" ></i>} modal
                      closeOnDocumentClick>
                      {close => (
                      <div style={{color:'#111'}} className="modal">
                      
                      <div className="header"> Close this Brand?</div>
                        {/* <p>This will terminate this outlet</p> */}
                        <div className="content">
                        <p>You cannot undo this action. Delete it?</p>
                        </div>
                        <div className="actions">
                        <button
                          className="button close-button"
                          onClick={()=>{this.closeBrand();setTimeout(()=>{
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
  edit(index){
       switch(index){
          case '1': this.setState({websiteEdit: !this.state.websiteEdit});
          break;
          case '2': {
              if(this.state.Active == 'Active'){
                  this.setState({Active:'Inactive'})
              }else{
                  this.setState({Active:'Active'})
              }
          }
          break; 
          case '3': this.setState({business_category: !this.state.business_category});
          break;
          case '4': this.setState({sub_category: !this.state.sub_category});
          break;
          case '5': this.setState({description: !this.state.description});
          break;
          case '6': this.setState({business_tags: !this.state.business_tags});
          break;
          default: return ''
      }
    
    
  }



  render() {





    return (
        <div className="animated fadeIn">
           
          
          {this.cardHEADER()}
          
          {/* <Col xs="12" sm="12" md="12"> */}
            <Card className='main-card-style'>
              
             
              {this.viewBRAND()}
            </Card>
          {/* </Col> */}
         
         
       
        </div>
    )
  }
}

export default ViewBrand;
