import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Header,Dimmer, Loader, Image,Segment,Button, Tab } from 'semantic-ui-react';
import {connect} from 'react-redux';
import {getQuoteAPI} from './actions';
import {firebaseApp} from './firebase';


//component
import FRONTENDGOAL from './components/FrontendGoal/FrontendGoal'
import GITHUBCOMMIT from './components/GithubCommit/GithubCommit';
import CALENDAR from './components/Calendar/Calendar';


const panes = [
  { menuItem: 'Front End', render: () => <Tab.Pane><FRONTENDGOAL/></Tab.Pane> },
  { menuItem: 'Back End', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
  { menuItem: 'Meeting', render: () => <Tab.Pane><CALENDAR/></Tab.Pane> },
  {menuItem: 'Github Commit',render: () => <Tab.Pane><GITHUBCOMMIT/></Tab.Pane> }
]

class App extends Component {
  componentWillMount() {
    this.props.getQuoteAPI();
  }
  onClick(){
    firebaseApp.auth().signOut()
    .then(() => {
      this.props.history.push('/')
    })
  }
  render() {
    if(!this.props.quote){
      return (
        <Segment className='Loader'>
         <Dimmer active inverted>
           <Loader inverted content='Loading' />
         </Dimmer>
         <Image src='/assets/images/wireframe/short-paragraph.png' />
        </Segment>
      )
    }
    return (
      <div className="App">
      <Header as='h5' block textAlign='center'>
        {this.props.quote}
      </Header>
      <div className='container'>
          <h3>Welcome back, {this.props.email}</h3>
          <Button secondary floated='right'
          onClick={this.onClick.bind(this)}
          >Sign Out</Button>
      </div>
      <Tab panes={panes} />
      </div>
    );
  }
}


function mapStateToProps({quote,email}) {
  return{quote,email}
}

export default connect(mapStateToProps,{getQuoteAPI})(App);
