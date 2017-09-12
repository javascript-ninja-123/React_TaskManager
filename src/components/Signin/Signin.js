import React, { Component } from 'react';
import './Signin.css';
import { Form,Header} from 'semantic-ui-react';
import {firebaseApp} from '../../firebase';
import {Link} from 'react-router-dom';
import {LoggedIn} from '../../actions';
import {connect} from 'react-redux';

class Signin extends Component {
  componentDidMount() {
    this.refs.EmailInput.value = '';
    this.refs.passwordInput.value = '';
  }
  constructor(props){
  	super(props);
  	this.state = {password:true,
      error:{}
    };
  }
  showPassword(e){
    e.preventDefault();
    this.state.password ? this.setState({password:false}) : this.setState({password:true})
  }
  onKeyPress(){
    this.setState({error:{}})
  }
  onSumbit(e){
    e.preventDefault()
    const email = this.refs.EmailInput.value;
    const password = this.refs.passwordInput.value;
    firebaseApp.auth().signInWithEmailAndPassword(email,password)
    .then(() => {
      this.props.LoggedIn(email);
    })
    .then(() => {
      this.refs.EmailInput.value = '';
      this.refs.passwordInput.value = '';
    })
    .then(() => {
      this.props.history.push('/app')
    })
    .catch(err => {
      console.log(err)
      this.setState({error:err})
    })
  }
  render() {
      return (
        <div className="SIGNUP">
          <Header as='h2' block textAlign='center'>
            Sign In
          </Header>
          <Form onSubmit={this.onSumbit.bind(this)}>
            <Form.Group widths='equal'>
              <div className='input'>
                <label>Email Address</label>
                <input type='email'
                ref='EmailInput'
                onKeyPress={this.onKeyPress.bind(this)}
                />
              </div>
              <div className='input'>
                <label>Password</label>
                <input  type={this.state.password ? 'password' : 'text'}
                ref='passwordInput'
                onKeyPress={this.onKeyPress.bind(this)}
                />
                <p
                onClick={this.showPassword.bind(this)}
                >{this.state.password? 'Show Password' : 'Hide Password'}</p>
              </div>
            </Form.Group>
            <Form.Button>Sign In</Form.Button>
            <Link to='/signup'>Sign up</Link>
          </Form>
          <h4>{this.state.error.message}</h4>
        </div>
      );
  }
}

export default connect(null,{LoggedIn})(Signin);
