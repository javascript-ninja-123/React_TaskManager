import React, {
  Component
} from 'react';
import moment from 'moment'
import {fetchGithubAPI} from '../../actions';
import {connect} from 'react-redux';
import './GithubCommit.css';
import { List, Image , Icon, Label, Select} from 'semantic-ui-react'


const repo = [
  {key:'des157',value:'des157',text:'des157'},
  {key:'exhibition2',value:'exhibition2',text:'exhibition2'}
]

class GITHUBCOMMIT extends Component {
  componentWillMount() {
    this.props.fetchGithubAPI('des157')
  }
  onChange(e){
    let repo = e.target.textContent;
    this.props.fetchGithubAPI(repo)
  }
  renderDOM(value,index){
    const {message} = value.commit;
    const {name,date} = value.commit.author;
    const newDate = moment(date).format('lll')
    return(
      <List.Item key={index}>
       <Image avatar src='https://avatars0.githubusercontent.com/u/19541825?v=4' />
       <List.Content>
         <List.Header as='h4'>{name}</List.Header>
         <List.Description>{message}</List.Description>
         <List.Description>{newDate}</List.Description>
         <Label>
            <Icon name='code' />
            <Label.Detail><a href={value.htmlURL} target='_blank'>View Commit</a></Label.Detail>
        </Label>
       </List.Content>
      </List.Item>
    )
  }
  render() {
    if(!this.props.github){
      return <div>Loading</div>
    }
    return (
      <div className='Github'>
         <Select placeholder='Select the repo' options={repo}
         onChange={this.onChange.bind(this)}
         />
        <List>
          {this.props.github.map(this.renderDOM)}
        </List>
      </div>
    )
  }
}
function mapStateToProps({github}) {
  return{github}
}

export default connect(mapStateToProps,{fetchGithubAPI})(GITHUBCOMMIT) ;
