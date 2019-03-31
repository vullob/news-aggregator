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


const Logo = (props) => {
    return<img {...{src: logo, height: 90, width: 90}}/>
  }

class Header extends React.Component {
  constructor(props){
    super(props)
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleSelect(e) {
    const {dispatch} = this.props
    const updateCategoryAction = {
      type: 'SET_SELECTED_CATEGORY',
      data: e
    }
    dispatch(updateCategoryAction)
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


  render(){
    const names = ["general","science", "entertainment", "sports", "business",  "technology", "health"]
    return  <React.Fragment> <Navbar bg="white" expand="lg">
        <Navbar.Brand href="#home">
          <Logo/>
        </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link href="#home" className="purple-text">Home</Nav.Link>
      <Dropdown navbar title="Category">
        <Dropdown.Toggle childBsPrefix="btn outline-white" className="purple-text" >Category</Dropdown.Toggle>
        <Dropdown.Menu>
          {this.renderDropdowns(names)}
      </Dropdown.Menu>
      </Dropdown>
    </Nav>
    <Form inline>
      <FormControl type="text" placeholder="Search" className="mr-sm-2 purple" />
      <Button variant="outline" className="purple">Search</Button>
    </Form>
  </Navbar.Collapse>
      </Navbar>
    </React.Fragment>;
  }

}

export default connect((state) => {return {selectedCategory: state.selectedCategory}})(Header)
