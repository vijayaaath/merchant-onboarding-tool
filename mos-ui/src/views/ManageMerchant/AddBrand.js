import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import {Link} from 'react-router-dom';
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
import { stat } from 'fs';



function saveBrandValidate(brandname, category, subcategory, description, tagsarray, imagefill, store, terms) {
  // true means invalid, so our conditions got reversed
  return {
    brandname: brandname.length === 0,
    category: category.length === 0,
    subcategory: subcategory.length === 0,
    description: description.length === 0,
    tagsarray: tagsarray.length === 0,
    imagefill: imagefill.length === 0,
    store: store.length === 0,
    terms: terms.length === 0,
  };
}


function saveBrandValidateWebsite(brandname, category, subcategory, description, tagsarray, imagefill, store, terms, website) {
  // true means invalid, so our conditions got reversed
  return {
    brandname: brandname.length === 0,
    category: category.length === 0,
    subcategory: subcategory.length === 0,
    description: description.length === 0,
    tagsarray: tagsarray.length === 0,
    imagefill: imagefill.length === 0,
    store: store.length === 0,
    terms: terms.length === 0,
    website: website.length === 0,
  };
}


class AddBrand extends Component {



  constructor(props) {
    super(props);
  
    this.state = { 
      selectedOption: '',
      selectedOptionSubCategories: [],
      categories: '',
      subCategories: '',
      selectedSubCategoriesForTags: [],
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
      store: '',
      isDisabledBrandName: false,
      isDisabledWebsiteURL: false,
      isDisabledCategories: false,
      isDisabledSubCategories: false,
      isDisabledDescription: false,
      brandID: '',
      brandImageExist: '',
      selectedOptionType: '',
      brandvalue: '',
      allbrands: '',
      suggestbrands: '',
      terms: '',
      promoteWebEdit: '',
      promoteWeb: 'no',
      onlineStoreRetrive: '',
      showexisterror: false,
      isDisabledTags: false,
      isDisabledImage: false,
      isDisabledStore: false,
      isDisabledTerms: false,
      showWebsiteMandatory: false,
      defaultCheck: false,
      defaultCheckTerms: false,
      physicalstoretrue: false,
      onlinestoretrue: false,
      bothtrue: false,
      creatable: true      
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
    this.loadbrand = this.loadbrand.bind(this);
    this.allbrands = this.allbrands.bind(this);
    this.handleBusinessTypeChange = this.handleBusinessTypeChange.bind(this);
    this.brandnamehandleOnChangeSelect = this.brandnamehandleOnChangeSelect.bind(this);
    this.handleStoreChange = this.handleStoreChange.bind(this);
    this.promote = this.promote.bind(this);
    this.terms = this.terms.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.gotoUser = this.gotoUser.bind(this);
    
    
  }
  
 

  componentDidMount()
  {
    //this.allbrands();
    this.loadcategories();
    this.setState({brandID: this.props.brandid});
    this.loadbrand(this.props.brandid);


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
        }
        else
        {
          this.setState({promoteWeb : 'no'});
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

  allbrands()
  {
    var auth = localStorage.getItem('auth');
    var self = this;
    var body = {};
    axios({
           method: 'get',
           url: API_ROOT+'api/brands/search/findDistinctBrands',
           data: body,
           headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

         })
         .then(function (response) {
       
          response.data.results.map((obj, key)=> {

                self.setState({allbrands: [...self.state.allbrands, {value: obj,label: obj}]});
          });
        
       })
       .catch(function (error) {
          
          self.setState({allbrands: [{value: " ",label: " "}]});

       }.bind(this));
  }

  loadbrand(brand_id)
  {

    var auth = localStorage.getItem('auth');
    var self = this;
    var body = {};
    if(brand_id != '')
    {
          axios({
             method: 'get',
             url: API_ROOT+'api/brands/'+brand_id,
             data: body,
             headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

           })
           .then(function (response) {
              
                
                self.setState({brandName: response.data.brand.name});
                var bname = {"label":response.data.brand.name,"value":response.data.brand.name};
                self.setState({brandvalue:bname});
                self.setState({websiteURL: response.data.brand.url});
                self.setState({description: response.data.brand.description});
                var cat = {"label":response.data.brand.category,"value":response.data.brand.category};
                self.setState({selectedOption:cat});
                var showonweb = {"label":response.data.brand.publishWithoutOffers,"value":response.data.brand.publishWithoutOffers};
                self.setState({selectedOptionType:showonweb});
                self.setState({brandCategory: response.data.brand.category});
                self.setState({promoteWebEdit: response.data.brand.publishWithoutOffers});
                               
                self.setState({store : response.data.brand.stores});
               
                document.getElementById("checkbox2").checked = true;
                self.setState({isDisabledTerms: false});
                self.setState({terms : '1'});

                self.setState({store:response.data.brand.stores});
                if(response.data.brand.stores == 'Online Store')
                {


                  self.setState({showWebsiteMandatory : true});

                  document.getElementById("inline-radio1").checked = true;
                }

                if(response.data.brand.stores == 'Physical Store')
                {                  

                  document.getElementById("inline-radio2").checked = true;
                }


                if(response.data.brand.stores == 'Both')
                {                  

                  self.setState({showWebsiteMandatory : true});

                  document.getElementById("inline-radio3").checked = true;
                }
                

                if(response.data.brand.publishWithoutOffers == 'yes')
                {
                  self.setState({promoteWeb:'yes'});
                  document.getElementById("checkbox1").checked = true;
                }
                else
                {
                  self.setState({promoteWeb:'no'});
                  document.getElementById("checkbox1").checked = false;
                }
                
                //self.setState({tags: response.data.brand.tagsList});



                response.data.brand.tagsList.map((obj, key)=> {

                let tags = self.state.tags;
                  tags.push({
                      id: obj,
                      text: obj
                  });
                  self.setState({tags: tags});
                 
                });


                

                 var auth = localStorage.getItem('auth');              
                  var body = {
                    "category":[response.data.brand.category]
                  };
                axios({
                  method: 'post',
                  url: API_ROOT+'api/tagsByCategoryName',
                  data: body,
                  headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

                  })
                  .then(function (response1) {


                    self.setState({suggestions: response1.data});
                   
                    
                })
                .catch(function (error) {
               
                }.bind(this));



                self.setState({brandImageExist: response.data.brand.imageResponse[0].image});


                var bodysc = {
                    "category":[response.data.brand.category]
                  };
                  axios({
                      method: 'post',
                      url: API_ROOT+'api/subcategoriesByCategory',
                      data: bodysc,
                      headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

                      })
                      .then(function (response2) {
                        self.setState({subCategories: []});
                         response2.data[response.data.brand.category].map((obj, key)=> {

                              self.setState({subCategories: [...self.state.subCategories, {value: obj,label: obj}]});
                        });
                    })
                    .catch(function (error) {
                    
                    }.bind(this));

               // var scat = {"label":response.data.brand.subCategories,"value":response.data.brand.subCategories};
               // self.setState({selectedOptionSubCategories:scat});
               //  self.setState({brandSubCategory: response.data.brand.subCategories});


                response.data.brand.subCategoryList.map((obj, key)=> {

                  let tags = self.state.selectedOptionSubCategories;
                  tags.push({
                      value: obj,
                      label: obj
                  });

                  self.setState({selectedOptionSubCategories : tags});
                   
                  });
                 
                 
          
             if(response.status == 200){
               
               
             }else{
               
             }
          
          
         })
         .catch(function (error) {
          
         
         }.bind(this)); 












    }
             
  }


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
    data.append('name', self.state.brandvalue.value);
    data.append('status', "active");
    //data.append('subCategories', self.state.brandSubCategory);
    data.append('url', self.state.websiteURL);
    data.append('tenantName', tenantName);
    data.append('merchantId', self.props.match.params.merchantid);
    data.append('stores', self.state.store);
    data.append('publishWithoutOffers', self.state.promoteWeb);

    if(self.state.brandID == '')
    {
        data.append('image', self.state.imageData1); 
    }
    else
    {
      if(self.state.imageData1 != '')
      {
        data.append('image', self.state.imageData1); 
      }
    }
    
    
    self.state.tags.map((obj, key)=> {
               
               data.append('tagsList', obj.text);
            })


            self.state.selectedOptionSubCategories.map((obj, key)=> {
               
              data.append('subCategoryList', obj.value);
           })

    if(self.state.brandID != '')
    {
        axios({
        method: 'post',
        url: API_ROOT+'api/brands/'+self.state.brandID,
        data: data,
        headers: {'Content-Type': 'multipart/form-data','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {

          localStorage.setItem("brandId",response.data);
          //window.location.reload();
          
           const { history } = self.props;
           history.push('/managemerchant/'+self.props.match.params.merchantid+'/2/brandupdated');
          
          
      })
      .catch(function (error) {
    
      }.bind(this));
    }
    else
    {
      axios({
        method: 'post',
        url: API_ROOT+'api/brands',
        data: data,
        headers: {'Content-Type': 'multipart/form-data','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {

          localStorage.setItem("brandId",response.data);
          if(self.props.match.params.msg == 'createbrand')
          {
            const { history } = self.props;
            history.push('/managemerchant/'+self.props.match.params.merchantid+'/3/createoutlet');
          }
          else
          {
            const { history } = self.props;
            history.push('/managemerchant/'+self.props.match.params.merchantid+'/2/brandadded');
          }
          
          
      })
      .catch(function (error) {
     
      }.bind(this));
    }
    


  }

  handleBrandName(event) {
    this.setState({brandName: event.target.value});
    this.setState({isDisabledBrandName: false});
  }


  handleWebsiteURL(event) {
    this.setState({
      websiteURL: event.target.value,
      isDisabledWebsiteURL: false
    });

  }


  handleDescription(event) {
    this.setState({description: event.target.value});
    this.setState({isDisabledDescription: false});
  }


   brandCanBeSubmitted() {
    if(this.state.brandvalue == '')
    {
      var bname = '';
    }
    else
    {
      var bname = this.state.brandvalue.value;
    }

    if(this.state.selectedOptionSubCategories.length == 0)
    {
      var subcategoryarray = '';
    }
    else
    {
      var subcategoryarray = '1';
    }
    if(this.state.tags.length == 0)
    {
      var tagsarray = '';
    }
    else
    {
      var tagsarray = '1';
    }
    if(this.state.imageData1.name == undefined)
    {
      if(this.state.brandImageExist == '')
      {
        var imagefill = '';
      }
      else
      {
        var imagefill = '1';
      }
      
    }
    else
    {
      var imagefill = '1';
    }

    if(this.state.showWebsiteMandatory)
    {
      const errors = saveBrandValidateWebsite(bname,this.state.brandCategory,subcategoryarray, this.state.description, tagsarray, imagefill, this.state.store, this.state.terms, this.state.websiteURL);
      const isDisabled = Object.keys(errors).some(x => errors[x]);
      this.setState({isDisabledBrandName: errors.brandname});
      this.setState({isDisabledCategories: errors.category});
      this.setState({isDisabledSubCategories: errors.subcategory});
      this.setState({isDisabledDescription: errors.description});
      this.setState({isDisabledTags: errors.tagsarray});
      this.setState({isDisabledImage: errors.imagefill});
      this.setState({isDisabledStore: errors.store});
      this.setState({isDisabledTerms: errors.terms});
      this.setState({isDisabledWebsiteURL: errors.website});
      return !isDisabled;
    }
    else
    {
      const errors = saveBrandValidate(bname,this.state.brandCategory,subcategoryarray, this.state.description, tagsarray, imagefill, this.state.store,this.state.terms);
      const isDisabled = Object.keys(errors).some(x => errors[x]);
      this.setState({isDisabledBrandName: errors.brandname});
      this.setState({isDisabledCategories: errors.category});
      this.setState({isDisabledSubCategories: errors.subcategory});
      this.setState({isDisabledDescription: errors.description});
      this.setState({isDisabledTags: errors.tagsarray});
      this.setState({isDisabledImage: errors.imagefill});
      this.setState({isDisabledStore: errors.store});
      this.setState({isDisabledTerms: errors.terms});
      return !isDisabled;
    }
  }


    handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    }
 
    handleAddition(tag) {
      this.setState(state => ({ tags: [...state.tags, tag] }));
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
  
      this.setState({imageFileName1: event.target.value.replace(/C:\\fakepath\\/i, '')});


      var reader = new FileReader();
      var file = event.target.files[0];

      
      this.setState({ imageData1: file });
      this.setState({isDisabledImage: false});


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

    self.setState({selectedOptionSubCategories : []});

    if(selectedOption!=null)
    { 
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
                let tags = self.state.selectedOptionSubCategories;
                tags.push({
                    value: obj,
                    label: obj
                });
                self.setState({selectedOptionSubCategories : tags});

                let subcategoriesfortags = self.state.selectedSubCategoriesForTags;
                subcategoriesfortags.push(obj);
                self.setState({selectedSubCategoriesForTags : subcategoriesfortags});

                self.setState({subCategories: [...self.state.subCategories, {value: obj,label: obj}]});
              });
          })
          .catch(function (error) {
          
          }.bind(this));


          axios({
            method: 'post',
            url: API_ROOT+'api/tagsByCategoryName ',
            data: body,
            headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

            })
            .then(function (response) {                                  

              self.setState({suggestions: response.data});             
              
          })
          .catch(function (error) {
            console.log(self.state.selectedSubCategoriesForTags);
          }.bind(this));

         



          this.setState({brandCategory: selectedOption['value']});
          this.setState({isDisabledCategories: false});
    }
    else
    {
        this.setState({brandCategory: ''});
        this.setState({isDisabledCategories: true});
    }
    

  }

  handleChangeSubCategories (selectedOptionSubCategories) {
    this.setState({ selectedOptionSubCategories });
    if(selectedOptionSubCategories!=null)
    {
      this.setState({brandSubCategory: selectedOptionSubCategories['value']});
      this.setState({isDisabledSubCategories: false});
    }
    else
    {
      this.setState({brandSubCategory: ''});
      this.setState({isDisabledSubCategories: true});
    }
  }
  
    brandnamehandleOnChangeSelect(brandvalue)
    {
        var self = this;
        self.setState({ brandvalue });
        if(brandvalue != null)
        {
            self.setState({isDisabledBrandName: false});
              var auth = localStorage.getItem('auth');
              var body = {};

              axios({
                  method: 'GET',
                  url: API_ROOT+'api/brands/findIfBrandExistsForMerchant?merchantId='+self.props.match.params.merchantid+'&brandName='+brandvalue.value,
                  data: body,
                  headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

                  })
                  .then(function (response) {

                    if(response.data == true)
                    {
                      self.setState({showexisterror: true});
                    }
                    else
                    {
                      self.setState({showexisterror: false});
                      axios({
                          method: 'GET',
                          url: API_ROOT+'api/brands/search?brandName='+brandvalue.value,
                          data: body,
                          headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

                          })
                          .then(function (response) {
                              self.setState({websiteURL: response.data.brand.url});
                              self.setState({description: response.data.brand.description});
                              var cat = {"label":response.data.brand.category,"value":response.data.brand.category};
                              self.setState({selectedOption:cat});
                              var showonweb = {"label":response.data.brand.publishWithoutOffers,"value":response.data.brand.publishWithoutOffers};
                              self.setState({selectedOptionType:showonweb});
                              self.setState({brandCategory: response.data.brand.category});  
                             response.data.brand.tagsList.map((obj, key)=> {

                              let tags = self.state.tags;
                                tags.push({
                                    id: tags.length + 1,
                                    text: obj
                                });
                                self.setState({tags: tags});
                               
                              });



                            //  self.setState({brandImageExist: response.data.brand.images[0].image});
                            
                        })
                        .catch(function (error) {
                       
                        }.bind(this));

                    }
                   
                    
                })
                .catch(function (error) {
               
                }.bind(this));
        }
        else
        {
            self.setState({isDisabledBrandName: true});
            self.setState({showexisterror: false});
        }
        
    }

    getUsers(input)
    {

          var auth = localStorage.getItem('auth');
          var self = this;
          var body = {};

          return axios({
              method: 'get',
              url: API_ROOT+'api/brands/name?name='+input,
              data: body,
              headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

              })
              .then(function (response) {

                response.data.map((obj, key)=> {

                  self.setState({suggestbrands: [...self.state.suggestbrands, {value: obj.name}]});
            });
                const brandnameoptions = [
                  { login: 'Pedro'},
                  { login: 'Martina'}
                ];
                return { options: self.state.suggestbrands };
            })
            .catch(function (error) {
          
            }.bind(this));
    }

    gotoUser (value, event) {
      window.open(value.html_url);
  }
  


  render() {
 const { selectedOption, selectedOptionSubCategories, selectedOptionType, defaultCheckTerms} = this.state;
 const value = selectedOption && selectedOption.value;
 const subCategoryValue = selectedOptionSubCategories && selectedOptionSubCategories.value;
 const { tags, suggestions } = this.state;
 const valueBusinessType = selectedOptionType && selectedOptionType.value;
const brandnameoptions = [
      { login: 'Pedro', label: 'Pedro' },
      { value: 'Martina', label: 'Martina' }
    ];

    const { brandvalue } = this.state;
    
    const AsyncComponent = this.state.creatable
			? Select.AsyncCreatable
: Select.Async;

    
  var self = this;  

    return (
        <div className="animated fadeIn">
        
            <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
          <FormGroup row>
                    <Col md="3">
                      <Label className='font-14' style={{fontWeight:600}}>Brand Name <span className="required">*</span></Label>
                    </Col>
                    <Col xs="12" md="9">
                    
                <AsyncComponent multi={false} value={brandvalue} onChange={this.brandnamehandleOnChangeSelect} valueKey="id" labelKey="value" loadOptions={this.getUsers} backspaceRemoves={true} onValueClick={this.gotoUser} placeholder="Brand name" className={this.state.isDisabledBrandName ? "error" : ""} />

                <FormText color="muted">Select existing brand name (or) Type new brand name and press enter</FormText>
                {this.state.showexisterror ? <FormText color="red">Selected Brand exist for this account, please enter another brand name</FormText> : <span></span> }
                    </Col>
        </FormGroup>

        <FormGroup row>
                    <Col md="3">
                      <Label className='font-14' style={{fontWeight:600}}>Business Category <span className="required">*</span></Label>
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
                        <Label className='font-14' style={{fontWeight:600}}>Sub-category <span className="required">*</span></Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Select
                          name="form-field-name"
                          value={selectedOptionSubCategories}
                          multi={true}
                          placeholder="Select"
                          onChange={this.handleChangeSubCategories}
                          options={this.state.subCategories}
                          className={this.state.isDisabledSubCategories ? "error" : ""}
                        />
                      </Col>
          </FormGroup>

          <FormGroup row>
                    <Col md="3">
                      <Label className='font-14' style={{fontWeight:600}}>Description <span className="required">*</span></Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="Description here" onChange={this.handleDescription} value={this.state.description} className={this.state.isDisabledDescription ? "error" : ""}/>
                    </Col>
        </FormGroup>

        <FormGroup row>
                    <Col md="3">
                      <Label className='font-14' style={{fontWeight:600}}>Business Highlights (Tags) <span className="required">*</span></Label>
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
                    {this.state.isDisabledTags ? <FormText color="red">Please enter tags</FormText> : <span></span> }
                    </Col>
        </FormGroup>

        <FormGroup row>
                    <Col md="3">
                      <Label className='font-14' style={{fontWeight:600}}>Store <span className="required">*</span></Label>
                    </Col>
                    <Col xs="12" md="9">
                      <FormGroup check inline>
                          <Input className="form-check-input" type="radio" id="inline-radio1" name="inline-radios" value="Online Store" onChange={this.handleStoreChange}/>
                          <Label className="form-check-label" check htmlFor="inline-radio1">Online Store</Label>
                      </FormGroup>

                      <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="inline-radio2" name="inline-radios" value="Physical Store" onChange={this.handleStoreChange}/>
                        <Label className="form-check-label" check htmlFor="inline-radio1">Physical Store</Label>
                      </FormGroup>

                      <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="inline-radio3" name="inline-radios" value="Both" onChange={this.handleStoreChange}/>
                        <Label className="form-check-label" check htmlFor="inline-radio1">Both</Label>
                      </FormGroup>
                      {this.state.isDisabledStore ?  <small class="form-text text-red">Please select store type.</small> : <small class="form-text text-red"></small> } 
                    </Col>
        </FormGroup> 

         <FormGroup row>
                    <Col md="3">
                      <Label className='font-14' style={{fontWeight:600}}>Website { this.state.showWebsiteMandatory ? <span className="required">*</span> : <span className="required"></span>}</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="https://" onChange={this.handleWebsiteURL} value={this.state.websiteURL} className={this.state.isDisabledWebsiteURL ? "error" : ""}/>
                    </Col>
        </FormGroup>

        <FormGroup row>

                    <Col md="3">
                      <Label className='font-14' style={{fontWeight:600}}>Brand Image <span className="required">*</span></Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Label htmlFor="text-input">

                        {this.state.brandImageExist != '' ? <p><img src={this.state.brandImageExist} className="brand-image"/><br/>(OR)</p> : <span></span> }

                      <Input type="file" ref="fileuploader" id="file-input1" name="user[image]" onChange={this.filesname1} />

                      <p><span className="font-italic imageTextSmall">( Size:  1300 px * 900 px</span> )</p>
                      {this.state.isDisabledImage ? <FormText color="red">Please select image</FormText> : <span></span> }
                       
                      </Label>
                      
                    </Col>
            </FormGroup>   


            <FormGroup row>
                <Col md="12"> <FormGroup check className="checkbox">
                        <Input className="form-check-input" ref="complete" type="checkbox" id="checkbox1" name="checkbox1" value="yes" onChange={this.promote}/>
                        <Label check className="form-check-label" htmlFor="checkbox1" className="font-14">I allow you to promote my brand even without offers</Label>
                      </FormGroup></Col>
                   
            </FormGroup>
            <FormGroup row>
                <Col md="12"> <FormGroup check className="checkbox">
                        <Input className="form-check-input" ref="complete" type="checkbox" id="checkbox2" name="checkbox2" value="yes" onChange={this.terms} />
                        <Label check className="form-check-label" htmlFor="checkbox2" className="font-14">I agree to the <a href="img/terms/MO_Terms.pdf" target="_blank">Terms of Use and Privacy Policy</a></Label>{this.state.isDisabledTerms ?  <small class="form-text text-red">Please agree Terms and Privacy Policy.</small> : <small class="form-text text-red"></small> } 
                      </FormGroup></Col>
                   
            </FormGroup>       
  
            </Form>
            <FormGroup row>
                <Col xs="6" md="6">
                  {this.props.match.params.msg == 'createbrand' ? <Button color="save-button" onClick={this.handleSaveBrand}>SAVE & ADD OUTLETS</Button> : <Button color="save-button" onClick={this.handleSaveBrand}>SAVE</Button> }
                </Col>
            </FormGroup>
         

        </div>
    )
  }
}

export default AddBrand;
