import React from 'react';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import useImage from 'use-image'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'

import logo from '../static/images/logo.svg'
import LoginModal from './loginModal'
import channel from './channel'


const Logo = (props) => {
    return<img {...{src: logo, height: 90, width: 90}}/>
  }

class Header extends React.Component {
  constructor(props){
    super(props)
    this.handleSelect = this.handleSelect.bind(this)
    this.showLoginModal = this.showLoginModal.bind(this)
    this.logout = this.logout.bind(this)
    this.changeSearch = this.changeSearch.bind(this)
    this.search = this.search.bind(this)
  }

  handleSelect(e) {
    const {dispatch} = this.props
    const updateCategoryAction = {
      type: 'SET_SELECTED_CATEGORY',
      data: e
    }
    dispatch(updateCategoryAction)
    dispatch({
      type: 'SET_PAGE_TYPE',
      data: 'browse'
    })
  }

  renderDropdowns(names) {
    const { selectedCategory } = this.props;
    return names.map((name) => <Dropdown.Item {...{
      onSelect: this.handleSelect,
      eventKey: name,
      className: "purple-text",
      active: name == selectedCategory ? "true": undefined,
      key: name}}>
      {name.charAt(0).toUpperCase() + name.slice(1)}
      </Dropdown.Item>)
  }

  logout(){
    const {dispatch} = this.props;
    const closeSessionAction  = {
      type: 'CLOSE_SESSION'
    }
    dispatch(closeSessionAction)
  }

  changeSearch(e){
    const { dispatch } = this.props
    const updateQueryAction = {
      type: 'UPDATE_SEARCH_QUERY',
      data: e.target.value
    }
    dispatch(updateQueryAction)
  }

  search() {
    const { searchQuery, dispatch} = this.props
    channel.search(searchQuery)

  }


  showLoginModal(){
    const { dispatch } = this.props;
    const showModalAction = {
      type: "SHOW_LOGIN_MODAL"
    }
    dispatch(showModalAction)
  }

  render(){
    const names = ["general","science", "entertainment", "sports", "business",  "technology", "health"]
    const { session , loginModal: {show}, searchQuery} = this.props;
    return  <React.Fragment> <Navbar bg="light" expand="lg">
        <Navbar.Brand onClick={() => this.handleSelect("general")}>
          <Logo/>
        </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link onClick={() => this.handleSelect("general")} className="purple-text">Home</Nav.Link>
      <Dropdown navbar title="Category">
        <Dropdown.Toggle childBsPrefix="btn nav-link" className="purple-text" >Category</Dropdown.Toggle>
        <Dropdown.Menu>
          {this.renderDropdowns(names)}
      </Dropdown.Menu>
      </Dropdown>
      <Nav.Link onClick={() => this.handleSelect("general")} className="purple-text">Favorites</Nav.Link>
    {session && <Nav.Link variant="outline" className="purple-text" onClick={this.logout}>Logout</Nav.Link>}
    {!session && <Nav.Link variant="outline" className="purple-text" onClick={this.showLoginModal} >Login</Nav.Link>}
    </Nav>
    <Form inline>
      <FormControl type="text" placeholder="Search" className="mr-sm-2 purple" value={searchQuery} onChange={this.changeSearch}/>
      <Button variant="outline" className="purple" onClick={this.search}>Search</Button>
    </Form>
  </Navbar.Collapse>
      </Navbar>
      {show && <LoginModal/>}
    </React.Fragment>;
  }

}

export default connect((state) => {return {loginModal: state.loginModal,
  session: state.session,
  searchQuery: state.searchQuery,
  selectedCategory: state.selectedCategory}})(Header)
