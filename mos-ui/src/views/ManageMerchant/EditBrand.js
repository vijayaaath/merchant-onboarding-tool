import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { WithContext as ReactTags } from 'react-tag-input';
import 'react-tag-input/example/reactTags.css';



function saveBrandValidate(brandname, websiteurl, category, subcategory, description) {
  // true means invalid, so our conditions got reversed
  return {
    brandname: brandname.length === 0,
    websiteurl: websiteurl.length === 0,
    category: category.length === 0,
    subcategory: subcategory.length === 0,
    description: description.length === 0,
  };
}



class EditBrand extends Component {



  constructor(props) {
    super(props);
   
    
    this.state = { 
      selectedOption: '',
      selectedOptionSubCategories: '',
      categories: [],
      subCategories: [],
      tags: [],
      suggestions: [],
      imageFileName1: '',
      imageFileName2: '',
      brandName: '',
      websiteURL: '',
      description: '',
      brandCategory: '',
      brandSubCategory: '',
      imageData1: '',
      imageData2: '',
      isDisabledBrandName: false,
      isDisabledWebsiteURL: false,
      isDisabledCategories: false,
      isDisabledSubCategories: false,
      isDisabledDescription: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSubCategories = this.handleChangeSubCategories.bind(this);
    this.loadcategories = this.loadcategories.bind(this);

    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.browseImage1 = this.browseImage1.bind(this);
    this.filesname1 = this.filesname1.bind(this);
    this.browseImage2 = this.browseImage2.bind(this);
    this.filesname2 = this.filesname2.bind(this);
    this.handleSaveBrand = this.handleSaveBrand.bind(this);
    this.handleBrandName = this.handleBrandName.bind(this);
    this.handleWebsiteURL = this.handleWebsiteURL.bind(this);
    this.handleDescription = this.handleDescription.bind(this);

    if(this.props.brandData){
        var STATE = this.state;
    STATE.brandName = this.props.brandData.name;
    STATE.websiteURL = this.props.brandData.url;
    STATE.description = this.props.brandData.description;
    var tags  = [];
    for(var a=0;a<this.props.brandData.tagsList.length;a++){
        tags.push({id:a,text:this.props.brandData.tagsList[a]})
    }
    STATE.selectedOption = {value:this.props.brandData.category,label:this.props.brandData.category}
     
        this.handleChange(STATE.selectedOption)
    STATE.tags = tags;
    this.setState({isDisabledCategories: false});
    setTimeout(()=>{
        this.setState({STATE})
    },100)
    }
  }
  
 

  componentDidMount()
  {
    this.loadcategories();
  }

// componentWillReceiveProps(nextProp){
//   
//     // if(this.props != nextProp){
//      
//         var STATE = this.state;
//         STATE.brandName = this.props.brandData.name;
//         STATE.websiteURL = this.props.brandData.url;
//         STATE.description = this.props.brandData.description;
//         //handleChange
//         STATE.selectedOption = {value:this.props.brandData.category,label:this.props.brandData.category}
//       
//        // STATE.selectedOptionSubCategories = this.props.brandData.description;
//         var tags  = [];
//         for(var a=0;a<this.props.brandData.tagsList.length;a++){
//             tags.push({id:a,text:this.props.brandData.tagsList[a]})
//         }
//         //selectedOption: '',
//      // selectedOptionSubCategories:
//         STATE.tags = tags;
//         setTimeout(()=>{
//             this.setState({STATE})
//         },100)
       
//     // }
// }

  handleSaveBrand(evt)
  {
    if (!this.brandCanBeSubmitted()) {
          evt.preventDefault();
          return;
      }


    var auth = localStorage.getItem('auth');
    var self = this;
    var tenantName = localStorage.getItem('tenantName');

    var data = new FormData();
    data.append('description', self.state.description);
    data.append('category', self.state.brandCategory);
    data.append('email', "admin@mail.com");
    data.append('name', self.state.brandName);
   // data.append('publishWithoutOffers', "yes");
    data.append('status', "active");
    data.append('subCategories', self.state.brandSubCategory);
    data.append('url', self.state.websiteURL);
    data.append('tenantName', tenantName);
    data.append('merchantId', this.props.brandData.merchant.merchantId);
    if(this.state.imageData1){
        data.append('image', this.state.imageData1);
    // data.append('image', this.state.imageData2);
    }
    
    
    
    this.state.tags.map((obj, key)=> {
               
               data.append('tags', obj.text);
            })


    axios({
        method: 'post',
        url: API_ROOT+'/api/brands/name/'+ window.location.href.split('=')[1],
        data: data,
        headers: {'Content-Type': 'multipart/form-data','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {

          localStorage.setItem("brandId",response.data);
          location.reload();
        //   const { history } = self.props;
        //   history.push('/base#brandName='+response.data);
          
      })
      .catch(function (error) {
       
      }.bind(this));


  }

  handleBrandName(event) {
    this.setState({brandName: event.target.value});
    this.setState({isDisabledBrandName: false});
  }


  handleWebsiteURL(event) {
    this.setState({websiteURL: event.target.value});
    this.setState({isDisabledWebsiteURL: false});
  }


  handleDescription(event) {
    this.setState({description: event.target.value});
    this.setState({isDisabledDescription: false});
  }


   brandCanBeSubmitted() {

    const errors = saveBrandValidate(this.state.brandName,this.state.websiteURL,this.state.brandCategory,this.state.brandSubCategory, this.state.description);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    this.setState({isDisabledBrandName: errors.brandname});
    this.setState({isDisabledWebsiteURL: errors.websiteurl});
    this.setState({isDisabledCategories: errors.category});
    this.setState({isDisabledSubCategories: errors.subcategory});
    this.setState({isDisabledDescription: errors.description});
    return !isDisabled;
  }


    handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    }
 
    handleAddition(tag) {
        let tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({tags: tags});
    }
 
    handleDrag(tag, currPos, newPos) {
        let tags = this.state.tags;
 
        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);
 
        // re-render
        this.setState({ tags: tags });
    }

    browseImage1()
    {
      document.getElementById("file-input1").click();
    }

    browseImage2()
    {
      document.getElementById("file-input2").click();
    }

    filesname1(event)
    {
      var self = this;
      self.setState({imageFileName1: event.target.value.replace(/C:\\fakepath\\/i, '')});

      var reader = new FileReader();
      var file = event.target.files[0];

      
      self.setState({ imageData1: file });

 

     

    }

    filesname2(event)
    {
      var self = this;
      self.setState({imageFileName2: event.target.value.replace(/C:\\fakepath\\/i, '')});
      var reader = new FileReader();
      var file = event.target.files[0];
      
      self.setState({ imageData2: file });
    }




  loadcategories()
  {
    var auth = localStorage.getItem('auth');
    var self = this;
    var body = {};
    axios({
        method: 'get',
        url: API_ROOT+'api/categories',
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
          response.data.content.map((obj, key)=> {

                self.setState({categories: [...self.state.categories, {value: obj.categoryName,label: obj.label}]});
          });
      })
      .catch(function (error) {
   
      }.bind(this));


  }


  handleChange (selectedOption) {
    var self = this;
    self.setState({ selectedOption });

    var auth = localStorage.getItem('auth');
    var category = selectedOption.value;
    var body = {
      "category":[selectedOption.value]
    };
    axios({
        method: 'post',
        url: API_ROOT+'api/subcategoriesByCategory',
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
          self.setState({subCategories: []});
           response.data[category].map((obj, key)=> {

                self.setState({subCategories: [...self.state.subCategories, {value: obj,label: obj}]});
          });
      })
      .catch(function (error) {

      }.bind(this));




      axios({
        method: 'post',
        url: API_ROOT+'api/tagsByCategory',
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {


          self.setState({suggestions: response.data[selectedOption.value]});
         
          
      })
      .catch(function (error) {
      
      }.bind(this));

     



      this.setState({brandCategory: selectedOption['value']});
      this.setState({isDisabledCategories: false});

  }

  handleChangeSubCategories (selectedOptionSubCategories) {
    this.setState({ selectedOptionSubCategories });
    this.setState({brandSubCategory: selectedOptionSubCategories['value']});
    this.setState({isDisabledSubCategories: false});

  }
  makeImage(){
      if(this.props.brandData.images[0]){
          return <div className='image-cards-edit' >
          <img src={this.props.brandData.images[0].image} className='image_style'/>
      </div>
      }else{
          return ''
      }
  }
  
    
    




  render() {



 const { selectedOption, selectedOptionSubCategories } = this.state;
 const value = selectedOption && selectedOption.value;
 const subCategoryValue = selectedOptionSubCategories && selectedOptionSubCategories.value;
 const { tags, suggestions } = this.state;


    return (
        <div className="animated fadeIn">
            <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
          <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Brand Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="Your brand name" onChange={this.handleBrandName} value={this.state.brandName} className={this.state.isDisabledBrandName ? "error" : ""}/>
                    </Col>
        </FormGroup>

         <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Website</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="https://" onChange={this.handleWebsiteURL} value={this.state.websiteURL} className={this.state.isDisabledWebsiteURL ? "error" : ""}/>
                    </Col>
        </FormGroup>

        <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Business Category</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Select
                        name="form-field-name"
                        value={value}
                        placeholder="Select"
                        onChange={this.handleChange}
                        options={this.state.categories}
                        className={this.state.isDisabledCategories ? "error" : ""}
                      />
                    </Col>
        </FormGroup>

        <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Sub-category</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Select
                        name="form-field-name"
                        value={subCategoryValue}
                        placeholder="Select"
                        onChange={this.handleChangeSubCategories}
                        options={this.state.subCategories}
                        // multi={true}
                        className={this.state.isDisabledSubCategories ? "error" : ""}
                      />
                    </Col>
        </FormGroup>

        <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Description</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="Description here" onChange={this.handleDescription} value={this.state.description} className={this.state.isDisabledDescription ? "error" : ""}/>
                    </Col>
        </FormGroup>

         <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Business Highlights (Tags)</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <ReactTags tags={tags}
                    suggestions={this.state.suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    autofocus={false}
                    />
                    <small className="form-text text-muted">( Select from the drown drop or type the tag/keyword )</small>
                    </Col>
        </FormGroup>

        <FormGroup row>

                    <Col md="3">
                      <Label htmlFor="text-input">Brand Image</Label>
                    </Col>
                    <Col xs="12" md="9">
                    {this.makeImage()}
                      <Label htmlFor="text-input"><Input type="file" ref="file" id="file-input1" name="user[image]" className="browseButton" onChange={this.filesname1}/>

                      <Button color="green" onClick={this.browseImage1}>Browse Image</Button><span>{this.state.imageFileName1}</span><p><span className="font-italic imageTextSmall">( Size:  1300 px * 900 px</span> )</p>              
                      </Label>
                    </Col>
            </FormGroup>
  
            </Form>
            <FormGroup row>
                <Col xs="6" md="6">
                  <Button color="save-button" onClick={this.handleSaveBrand}>Update</Button>
                </Col>
            </FormGroup>


        </div>
    )
  }
}

export default EditBrand;
