import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import UserDetail from '../UserDetail/';
import { API_ROOT } from '../../../api-config';
import {
  Badge,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import axios from 'axios';
import { hashHistory } from 'react-router';

class User extends React.Component{

	render() {

		return (
			<tr>
                    <td>{this.props.user.name}</td>
                    <td>{this.props.user.email}</td>				
                    <td>{this.props.user.role[0]['role']}</td>
                    <td><Link to={"/admin/userdetail/"+this.props.user.id+""}><i className="icon-pencil icons font-2xl d-block mt-4"></i></Link></td>

            </tr>
			
		)
	}
}

class Page extends React.Component{

	handleClick(e){
		this.props.loadUsers(this.props.idx)
	}

	render() {
		return (
			<PaginationItem className={"" + (this.props.currPage == this.props.idx ? "active" : "")}>
                    <PaginationLink onClick={() => {this.handleClick(this.props.idx)}}	>{this.props.idx + 1}</PaginationLink>
            </PaginationItem>			
		)
	}
}


class UserList extends Component {

	constructor(props) {
		super(props);
		this.state = {users: [],
			"page":		{
			    "size" : 1,
			    "totalElements" : 1,
			    "totalPages" : 1,
			    "number" : 2
			},
      "searchText":"test"

		};
		this.loadUsers = this.loadUsers.bind(this);
    this.searchRequest = this.searchRequest.bind(this);
    this.handleSearchText = this.handleSearchText.bind(this);
	}	

	componentDidMount() {
	
		this.loadUsers(0);
	}


	loadUsers(pageNo){
		var self = this;
    var auth = localStorage.getItem('auth');
    var body = {};

	

    axios({
        method: 'get',
        url: API_ROOT+'api/users?size=5&page='+pageNo,
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
        self.setState({users: response.data.content});
        self.setState({page: response.data});
      })
      .catch(function (error) {
      
      }.bind(this));

	}

  searchRequest()
  {
    var searchtext = this.state.searchText;

    var self = this;
    var auth = localStorage.getItem('auth');
    var body = {};


  

    axios({
        method: 'get',
        url: API_ROOT+'api/users/search/findByEmail?email='+searchtext,
        data: body,
        headers: {'Content-Type': 'application/json','Accept': 'application/hal+json', 'Authorization':auth}

        })
        .then(function (response) {
        self.setState({users: response.data.content});
        self.setState({page: response.data});
      })
      .catch(function (error) {
     
      }.bind(this));




  }

  handleSearchText(event)
  {
    this.setState({searchText: event.target.value});
  }

  render() {

  	var users = this.state.users.map(user =>
			<User key={user.id} user={user}/>
		);

  	var paginationItems = [];
  	for (var i = 0; i < this.state.page.totalPages; i++) {    
    	paginationItems.push(<Page onClick key={i} idx={i} currPage={this.state.page.number} loadUsers={this.loadUsers}/>);
	}

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
          <FormGroup row className="float-right">
                    <Col md="12">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <Button type="button" color="primary" onClick={this.searchRequest}><i className="fa fa-search"></i> Search</Button>
                        </InputGroupAddon>
                        <Input type="text" id="input1-group2" name="input1-group2" onChange={this.handleSearchText} placeholder="Email"/>
                      </InputGroup>
                    </Col>
                  </FormGroup>
            </Col>
        </Row>
        
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader className="white-bg">
                <i className="fa fa-align-justify"></i> Users list
                <Link to="/admin/userdetail" className="float-right">Create User</Link>
              </CardHeader>
              <CardBody>
                <Table responsive bordered>
                  <thead>
                  <tr>
                    <th>Name</th> 
                    <th>Email</th>                    
                    <th>Role</th>
                    <th>Edit</th>
                  </tr>
                  </thead>
                  <tbody>                  
                  	{users}
                  </tbody>
                </Table>
                <Pagination>
                  <PaginationItem className={"" + (this.state.page.number == 0 ? "disabled" : "")}>
                  	<PaginationLink previous onClick={() => {this.loadUsers(this.state.page.number - 1)}}>Prev</PaginationLink>
                  </PaginationItem>
                  {paginationItems}
                  <PaginationItem className={"" + (this.state.page.totalPages - 1 ==  this.state.page.number ? "disabled" : "")}>
                  	<PaginationLink next onClick={() => {this.loadUsers(this.state.page.number + 1)}}>Next</PaginationLink>
                  </PaginationItem>
                </Pagination>
              </CardBody>
            </Card>
          </Col>
        </Row>

      </div>

    )
  }
}


export default UserList;