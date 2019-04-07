import React from 'react';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

class Footer extends React.Component {
  constructor(props){
    super(props)
    }
  render(){
  return <div className="fixed-bottom">
      <Navbar bg="light" expand="lg">
                   <Container>
                     <Navbar.Brand className="purple-text">News <p>A CS4550 Project</p></Navbar.Brand>
                     <div className="row purple-text">
                     <div className="col-8">
                        <p>Images Licensed from:
                           <br/>
                        <a href="http://www.danilodemarco.com/" target="_blank" rel="noopener noreferrer" className="red-text">Danilo Demarco</a>
                        <br/>
                        <a href="https://www.paomedia.com/" target="_blank" rel="noopener noreferrer" className="red-text">Paomedia</a>
                        <br/>
                        <a href="https://www.iconfinder.com/arunxthomas" target="_blank" rel="noopener noreferrer" className="red-text">Arun Thomas</a>
                        <br/>
                        <a href="http://www.bogdanrosu.com/" target="_blank" rel="noopener noreferrer" className="red-text">Bogdan Rosu</a>
                     </p>
                     </div>
                     <div className="col">
                        <p>Powered By <a href="https://newsapi.org"  target="_blank" rel="noopener noreferrer" className="red-text">NewsApi.org</a></p>
                     </div>
                     </div>
                     <Button variant="outline" className="purple" onClick={this.props.hideFooter}>Hide</Button>
                </Container>
      </Navbar>
   </div>
  }

}

export default Footer
