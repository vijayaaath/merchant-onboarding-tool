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
      selectedOptionType:'',
      imageData1: '',
      imageData2: '',
      isDisabledBrandName: false,
      isDisabledWebsiteURL: false,
      isDisabledCategories: false,
      isDisabledSubCategories: false,
      isDisabledDescription: false,
      terms: '',
      promoteWebEdit: '',
      promoteWeb: 'no',
      isDisabledStore: false,
      isDisabledTerms: false,
      isDisabledpromoteWeb: false,
      showWebsiteMandatory: false,
      defaultCheck: false,
      defaultCheckTerms: false,
      onlinestorechecked: false,
      physicalstorechecked: false,
      bothstorechecked: false
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
    this.handleBusinessTypeChange = this.handleBusinessTypeChange.bind(this);
    this.handleStoreChange = this.handleStoreChange.bind(this);
    this.promote = this.promote.bind(this);
    this.terms = this.terms.bind(this);

    if(this.props.brandData){
     
        var STATE = this.state;
    STATE.brandName = this.props.brandData.name;
    STATE.websiteURL = this.props.brandData.url;
    STATE.description = this.props.brandData.description;
    var tags  = [];
    for(var a=0;a<this.props.brandData.tagsList.length;a++){
        tags.push({id:this.props.brandData.tagsList[a],text:this.props.brandData.tagsList[a]})
    }

    var subcatlist  = [];
    for(var a=0;a<this.props.brandData.subCategoryList.length;a++){
      subcatlist.push({value:this.props.brandData.subCategoryList[a],label:this.props.brandData.subCategoryList[a]})
    }

  

    STATE.selectedOption = {value:this.props.brandData.category,label:this.props.brandData.category}
    STATE.brandCategory = this.props.brandData.category;


    var auth = localStorage.getItem('auth'); 
    var bodysc = {
      "category":[this.props.brandData.category]
    };
    var self = this;
    axios({
        method: 'post',
        url: API_ROOT+'api/subcategoriesByCategory',
        data: bodysc,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response2) {
          self.setState({subCategories: []});
           response2.data[self.props.brandData.category].map((obj, key)=> {

                self.setState({subCategories: [...self.state.subCategories, {value: obj,label: obj}]});
          });
      })
      .catch(function (error) {
      
      }.bind(this));

      axios({
        method: 'post',
        url: API_ROOT+'api/tagsByCategoryName',
        data: bodysc,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response1) {


          self.setState({suggestions: response1.data});
         
          
      })
      .catch(function (error) {
     
      }.bind(this));
    



    STATE.selectedOptionSubCategories = subcatlist;
    STATE.brandSubCategory = this.props.brandData.subCategories;
    STATE.tags = tags;

    
    STATE.store =  this.props.brandData.stores;
    
                if(this.props.brandData.stores == 'Online Store')
                {


                  STATE.showWebsiteMandatory = true;

                  STATE.onlinestorechecked = true;

                 //document.getElementById("inline-radio1").defaultChecked = true;
                }

                if(this.props.brandData.stores == 'Physical Store')                
                {                  
                  STATE.physicalstorechecked = true;
                  //document.getElementById("inline-radio2").defaultChecked = true;
                }


                if(this.props.brandData.stores == 'Both')
                {                  

                  STATE.showWebsiteMandatory = true;
                  STATE.bothstorechecked = true;
                  //document.getElementById("inline-radio3").defaultChecked = true;
                }


    if(this.props.brandData.publishWithoutOffers.includes('yes')){
      var showonweb = {value:'yes',label:'yes'};
    }else{
      var showonweb = {value:'no',label:'no'};
    }


    if(this.props.brandData.publishWithoutOffers.includes('yes'))
                {
                  STATE.defaultCheck = true;
                  STATE.promoteWeb = 'yes';
                }
                else
                {
                  STATE.defaultCheck = false;
                  STATE.promoteWeb = 'no';
                }
                STATE.defaultCheckTerms = true;
   
   
    this.setState({isDisabledCategories: false});
    setTimeout(()=>{
      this.setState({selectedOptionType:showonweb});
        this.setState({STATE})
    },100)
    }
  }
  
  handleBusinessTypeChange (selectedOptionType) {
    this.setState({ selectedOptionType });
  }



  handleStoreChange(e)
  {
    this.setState({store : e.target.value});
    if(e.target.value == 'Online Store' || e.target.value == 'Both')
    {
      this.setState({showWebsiteMandatory : true});
    }
    else
    {
      this.setState({showWebsiteMandatory : false});
      this.setState({isDisabledWebsiteURL : false});
    }
    this.setState({isDisabledStore: false});
  }

  promote(e)
  {

    if(e.target.checked)
    {
      this.setState({promoteWeb : 'yes'});
      this.setState({isDisabledpromoteWeb : false});
    }
    else
    {
      this.setState({promoteWeb : 'no'});
      this.setState({isDisabledpromoteWeb : true});
    }
  }


  terms(e)
  {    
    if(e.target.checked)
    {
      this.setState({isDisabledTerms : false});
      this.setState({terms : '1'});
    }
    else
    {
      this.setState({terms : ''});
    }    
  }

  componentDidMount()
  {
    this.loadcategories();
  }

// componentWillReceiveProps(nextProp){

//     // if(this.props != nextProp){

//         var STATE = this.state;
//         STATE.brandName = this.props.brandData.name;
//         STATE.websiteURL = this.props.brandData.url;
//         STATE.description = this.props.brandData.description;
//         //handleChange
//         STATE.selectedOption = {value:this.props.brandData.category,label:this.props.brandData.category}

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
    //data.append('subCategories', self.state.brandSubCategory);
    data.append('url', self.state.websiteURL);
    data.append('tenantName', tenantName);
    data.append('merchantId', this.props.brandData.merchant.merchantId);
    data.append('stores', self.state.store);
    data.append('publishWithoutOffers', this.state.promoteWeb);
    if(this.state.imageData1){
        data.append('image', this.state.imageData1);
    // data.append('image', this.state.imageData2);
    }
    
    
    
    this.state.tags.map((obj, key)=> {
               
               data.append('tags', obj.text);
            })

            self.state.selectedOptionSubCategories.map((obj, key)=> {
               
              data.append('subCategoryList', obj.value);
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

    if(this.state.selectedOptionSubCategories.length == 0)
    {
      var subcategoryarray = '';
    }
    else
    {
      var subcategoryarray = '1';
    }

    const errors = saveBrandValidate(this.state.brandName,this.state.websiteURL,this.state.brandCategory,subcategoryarray, this.state.description);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    this.setState({isDisabledBrandName: errors.brandname});
    // this.setState({isDisabledWebsiteURL: errors.websiteurl});
    this.setState({isDisabledCategories: errors.category});
    this.setState({isDisabledSubCategories: errors.subcategory});
    this.setState({isDisabledDescription: errors.description});
    return !isDisabled;
  }


    handleDelete(i) {
        const { tags } = this.state;
        this.setState({
         tags: tags.filter((tag, index) => index !== i),
        });
    }

    handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }

    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: newTags });
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
        self.setState({selectedOptionSubCategories : []});
         response.data[category].map((obj, key)=> {
          let tags = self.state.selectedOptionSubCategories;
          tags.push({
              value: obj,
              label: obj
          });
          self.setState({selectedOptionSubCategories : tags});

          

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
      if(this.props.brandData.imageResponse[0]){
          return <div className='image-cards-edit' >
          <img src={this.props.brandData.imageResponse[0].image} className='image_style'/>
      </div>
      }else{
          return ''
      }
  }
  
    
    




  render() {



 const { selectedOption, selectedOptionSubCategories, selectedOptionType } = this.state;
 const value = selectedOption && selectedOption.value;
 const subCategoryValue = selectedOptionSubCategories && selectedOptionSubCategories.value;
 const { tags, suggestions } = this.state;
 const valueBusinessType = selectedOptionType && selectedOptionType.value;

    return (
        <div className="animated fadeIn">
            <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
          <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Brand Name <span className="required">*</span></Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="Your brand name" onChange={this.handleBrandName} value={this.state.brandName} className={this.state.isDisabledBrandName ? "error" : ""}/>
                    </Col>
        </FormGroup>         

        <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Business Category <span className="required">*</span></Label>
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
                      <Label htmlFor="text-input">Sub-category <span className="required">*</span></Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Select
                        name="form-field-name"
                        multi={true}
                        value={this.state.selectedOptionSubCategories}
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
                      <Label htmlFor="text-input">Description <span className="required">*</span></Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="Description here" onChange={this.handleDescription} value={this.state.description} className={this.state.isDisabledDescription ? "error" : ""}/>
                    </Col>
        </FormGroup>
       
         <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Business Highlights (Tags) <span className="required">*</span> </Label>
                    </Col>
                    <Col xs="12" md="9">
                      <ReactTags tags={tags}
                    suggestions={this.state.suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    autofocus={false}
                    allowDeleteFromEmptyInput={false}
                    />
                    <small className="form-text text-muted">( Select from the drown drop or type the tag/keyword and press enter )</small>
                    </Col>
        </FormGroup>
      
        <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Store <span className="required">*</span></Label>
                    </Col>
                    <Col xs="12" md="9">
                      <FormGroup check inline>
                          <Input className="form-check-input" type="radio" id="inline-radio1" name="inline-radios" value="Online Store" onChange={this.handleStoreChange} defaultChecked={this.state.onlinestorechecked}/>
                          <Label className="form-check-label" check htmlFor="inline-radio1">Online Store</Label>
                      </FormGroup>

                      <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="inline-radio2" name="inline-radios" value="Physical Store" onChange={this.handleStoreChange} defaultChecked={this.state.physicalstorechecked}/>
                        <Label className="form-check-label" check htmlFor="inline-radio2">Physical Store</Label>
                      </FormGroup>

                      <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="inline-radio3" name="inline-radios" value="Both" onChange={this.handleStoreChange} defaultChecked={this.state.bothstorechecked}/>
                        <Label className="form-check-label" check htmlFor="inline-radio3">Both</Label>
                      </FormGroup>
                      {this.state.isDisabledStore ?  <small class="form-text text-red">Please select store type.</small> : <small class="form-text text-red"></small> } 
                    </Col>
        </FormGroup>


        <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Website { this.state.showWebsiteMandatory ? <span className="required">*</span> : <span className="required"></span>}</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="https://" onChange={this.handleWebsiteURL} value={this.state.websiteURL} className={this.state.isDisabledWebsiteURL ? "error" : ""}/>
                    </Col>
        </FormGroup>

        <FormGroup row>

                    <Col md="3">
                      <Label htmlFor="text-input">Brand Image <span className="required">*</span></Label>
                    </Col>
                    <Col xs="12" md="9">
                    {this.makeImage()}
                      <Label htmlFor="text-input"><Input type="file" ref="file" id="file-input1" name="user[image]" className="browseButton" onChange={this.filesname1}/>

                      <Button color="green" onClick={this.browseImage1}>Browse Image</Button><span>{this.state.imageFileName1}</span><p><span className="font-italic imageTextSmall">( Size:  1300 px * 900 px</span> )</p>              
                      </Label>
                    </Col>
            </FormGroup>

          
          <FormGroup row>
                <Col md="12"> <FormGroup check className="checkbox">
                        <Input className="form-check-input" ref="complete" type="checkbox" id="checkbox1" name="checkbox1" value="yes" onChange={this.promote} defaultChecked={this.state.defaultCheck}/>
                        <Label check className="form-check-label" htmlFor="checkbox1">I allow you to promote my brand even without offers</Label>
                      </FormGroup></Col>
                   
            </FormGroup>
            <FormGroup row>
                <Col md="12"> <FormGroup check className="checkbox">
                        <Input className="form-check-input" ref="complete" type="checkbox" id="checkbox2" name="checkbox2" value="yes" onChange={this.terms} defaultChecked={this.state.defaultCheckTerms}/>
                        <Label check className="form-check-label" htmlFor="checkbox2">I agree to the <a href="img/terms/MO_Terms.pdf" target="_blank">Terms of Use and Privacy Policy</a></Label>{this.state.isDisabledTerms ?  <small class="form-text text-red">Please agree Terms and Privacy Policy.</small> : <small class="form-text text-red"></small> } 
                      </FormGroup></Col>
                   
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
