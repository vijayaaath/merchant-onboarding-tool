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
 import Widget04 from '../Dashboard/Widget04'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import EditBrand from './EditBrand'




class BrandDetail extends Component {



    constructor() {
    super();
    this.state = {
      website: '',
      businessCategories: '',
      subCategories: '',
      description: '',
      brandImages: '',
      tags: [],
      tagsLocals: '',
      outletCount: '',
      activeOffers: '',
      pendingOffers: '',
      countryCityMap: [],
      showBusiness: '',
      store: ''
    };
    this.getTags = this.getTags.bind(this);
    this.getSubCategory = this.getSubCategory.bind(this);
    this.countryCityMap = this.countryCityMap.bind(this);
  }

  componentDidMount()
  {

    this.loadBrand(this.props.brandID);
    this.setState({test:"tesy"});
  }

  componentWillReceiveProps(nextProps)
    {
      if(this.props != nextProps)
      {
        this.setState({brandIDs: nextProps.brandID});
      }
    }

  loadBrand(brandID)
  {
    var auth = localStorage.getItem('auth');
    var self = this;
    var brandId = brandID;
    
    var body = {};
    return  axios({
       method: 'get',
       url: API_ROOT+'api/brands/'+brandId,
       data: body,
       headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

     })
     .then(function (response) {

          if(response.data.brand.imageResponse.length > 0)
          {
            self.setState({brandImages: response.data.brand.imageResponse[0].image});
          }
          
          self.setState({website: response.data.brand.url});
          self.setState({description: response.data.brand.description});
          self.setState({businessCategories: response.data.brand.category});
          self.setState({subCategories: response.data.brand.subCategoryList});
          self.setState({tags: response.data.brand.tagsList});
          self.setState({outletCount: response.data.outletCount});
          self.setState({activeOffers: response.data.activeOfferCount});
          self.setState({pendingOffers: response.data.pendingOfferCount});
          self.setState({countryCityMap: response.data.countryCityMap});
          self.setState({showBusiness: response.data.brand.publishWithoutOffers});
          self.setState({store: response.data.brand.stores});

         
    
       if(response.status == 200){
          
         
       }else{
         
       }
    
    
   })
   .catch(function (error) {
    

   }.bind(this)); 
  
  }

  getTags()
  {
      var tag_locals = []

            for (var a =0;a<this.state.tags.length;a++){
                tag_locals.push(<Badge pill color='primary' key={a} style={{marginRight:5+'px'}} >{this.state.tags[a]} </Badge> )
            }
            return (
                <p>{tag_locals}</p>
              );
  }

  getSubCategory()
  {
      var subcategory_locals = []

            for (var a =0;a<this.state.subCategories.length;a++){
              subcategory_locals.push(<span>{this.state.subCategories[a]}, </span> )
            }
            return (
                <p>{subcategory_locals}</p>
              );
  }

  countryCityMap(){
    
    for(var key in this.state.countryCityMap){
        return <p style = {{textTransform:'capitalize'}}>{key}: {this.state.countryCityMap[key]}</p>
    }
    
  }

  render() {




    return (
        <div className="animated fadeIn">
           

          <Row>
                  <Col xs="12" sm="12" md="12">
                    <Label className='boldhead'>Business Category</Label>
                    <p>{this.state.businessCategories}</p>
                  </Col>
          </Row>

          <Row>
                  <Col xs="12" sm="12" md="12">
                    <Label className='boldhead'>Sub Categories</Label>
                    <p>{this.getSubCategory()}</p>
                  </Col>
          </Row>

          <Row>
                  <Col xs="12" sm="12" md="12">
                    <Label className='boldhead'>Description</Label>
                    <p>{this.state.description}</p>
                  </Col>
          </Row>

          <Row>
                  <Col xs="12" sm="12" md="12">
                    <Label className='boldhead'>Business Highlights(Tags)</Label>
                    <p>{this.getTags()}</p>
                  </Col>
          </Row>

          <Row>
                  <Col xs="12" sm="12" md="12">
                    <Label className='boldhead'>Store</Label>
                    <p>{this.state.store}</p>
                  </Col>
          </Row>
          { this.state.website != '' ? <Row>
                  <Col xs="12" sm="12" md="12">
                    <Label className='boldhead'>Website</Label>
                    <p>{this.state.website}</p>
                  </Col>
          </Row> : <span></span> }
                             

          <Row>
                  <Col xs="12" sm="12" md="12">
                    <Label className='boldhead'>Promote brand to web even without offers?</Label>
                    <p>{this.state.showBusiness}</p>
                  </Col>
          </Row>           


           <Row>
                  <Col xs="12" sm="12" md="12">
                    <Label className='boldhead'>Brand Image</Label>
                    <p><img src={this.state.brandImages} className="brand-image" /></p>
                  </Col>


                  <div className='gray-back'>
                  <Col xs='12' sm='12' md='12' style={{marginTop:20+'px'}}>
                
                
                <Row>
              
                    <Col xs="12" lg="4" sm="12" md="4">
                        <Widget04 icon="" color="#56bddb" className="bg-main" header={this.state.outletCount || '0'} value="31">Outlet Count</Widget04>
                    </Col>
                    <Col xs="12" lg="4" sm="12" md="4">
                        <Widget04 icon="" color="#fec10f" className="bg-second" header={this.state.activeOffers || '0'} value="31">Active Offers</Widget04>
                    </Col>
                    <Col xs="12" lg="4" sm="12" md="4">
                        <Widget04 icon="" color="#a9d18e" className="bg-third" header={this.state.pendingOffers || '0'} value="31">Pending Offers</Widget04>
                    </Col>

                  </Row>
                  </Col>

              <Col xs='12' sm='12' md='12'>
                  <Label className='boldhead'> Markets</Label>
                 
                 {this.countryCityMap()}

                 
                  
              </Col>
              </div>   
          </Row>

  
       
        </div>
    )
  }
}

export default BrandDetail;
