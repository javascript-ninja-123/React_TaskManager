import React, { Component } from 'react';
import _ from 'lodash'
import './FrontendGoal.css';
import { Input,Button,Label,Select,List,Rating,Accordion ,TextArea,Form,Header,Icon,Tab} from 'semantic-ui-react'
import {connect} from 'react-redux';
import {addFrontEnd,fetchFrontEnd,sortByPriority,updateFrontEnd,removeFrontEnd,workingFrontend,movetoNewRefFrontEnd,fetchfrontEndCompleted} from '../../actions'


const Priority = [
  {key:'default',value:'default',text:'choose one'},
  {key:'low',value:'low',text:'low'},
{key:'medium',value:'medium',text:'medium'},
{key:'high',value:'high',text:'high'}
];

const filterResult = [
  {key:'Date',value:'Date',text:'Date'},
  {key:'Priority',value:'Priority',text:'Priority'}
]

const panels = (textarea) => {
  return _.times(1, () => ({
    title: 'detailed',
    content: textarea,
  }))
}

const panes = (func,func2) => {
return [
  { menuItem: `Things to finish`, render: () => <Tab.Pane> <List divided relaxed>
      {func}
    </List></Tab.Pane> },
  { menuItem: 'Completed', render: () => <Tab.Pane><List divided relaxed>
      {func2}
    </List></Tab.Pane> }
]
}


class FRONTENDGOAL extends Component {
  constructor(props){
  	super(props);
  	this.state = {task:'',date:'', priority:'',textarea:''};
    this.renderDOM = this.renderDOM.bind(this);
    this.getRating = this.getRating.bind(this);
    this.handleRate = this.handleRate.bind(this);
    this.onClickRemoveIcon = this.onClickRemoveIcon.bind(this);
  }
  componentWillMount() {
      this.props.fetchFrontEnd()
      this.props.fetchfrontEndCompleted();
  }
  onChangeTask(e){
    this.setState({task:e.target.value})
  }
  onChangeDate(e){
    this.setState({date:e.target.value})
  }
  onChangeTextArea(e){
    this.setState({textarea:e.target.value})
  }
  onChangePriority(e){
    let value = e.target.textContent;
    if(value === 'low') this.setState({priority:[0,value]})
    else if(value === 'default') this.setState({priority:[0,'low']})
    else if(value === 'medium') this.setState({priority:[1,value]})
    else if(value === 'high') this.setState({priority:[2,value]})

  }
  onChangeFilter(e){
    this.props.sortByPriority(e.target.textContent);
  }
  onClick(e){
    e.preventDefault()
    const {task,date,priority,textarea} = this.state;
    let newPromise = new Promise(resolve => {
      resolve(this.props.addFrontEnd(task,date,priority,textarea));
    })
    newPromise
    .then(() => {
      this.setState({task:'',date:'',priority:'',textarea:''})
    })
    .then(() => {
        this.props.fetchFrontEnd()
    })
  }
  handleRate(e,id){
    let newRating = parseInt(e.target.getAttribute('aria-posinset'));
    if(newRating === 1) this.props.updateFrontEnd(newRating,'low',id);
    else if(newRating === 2) this.props.updateFrontEnd(newRating,'medium',id);
    else if(newRating === 3) this.props.updateFrontEnd(newRating,'high',id);
  }
  getRating(value,id){
    if(value === 'low') return  <Rating icon='star' defaultRating={1} maxRating={3} onRate={(e) => this.handleRate(e,id)}/>
    else if(value === 'medium') return <Rating icon='star' defaultRating={2} maxRating={3} onRate={(e) => this.handleRate(e,id)}/>
    else if(value === 'high') return <Rating icon='star' defaultRating={3} maxRating={3} onRate={(e) => this.handleRate(e,id)}/>
  }
  onClickRemoveIcon(id){
    this.props.removeFrontEnd(id)
  }
  onClickWorkingIcon(id,working){
    this.props.workingFrontend(id,working)
  }
  workNotification(working){
    if(working) return <span className='inProgress'>In progress</span>
  }
  onClicktoMoveRef(id){
    let newPromise = new Promise(resolve => {
      resolve(this.props.movetoNewRefFrontEnd(id))
    })

    newPromise
    .then(() => {
      this.props.fetchfrontEndCompleted()
    })
  }

  renderDOM(value,index){
    return(
      <List.Item key={index}>
      <List.Content className='listContent'>
        <div className='FlexColumn'>
        <List.Header as='h3'>{value.task} {this.workNotification(value.isWorking)}</List.Header>
        <List.Description as='p'>priority {value.priority[1]} {this.getRating(value.priority[1],value.id)}</List.Description>
        <List.Description as='p'>{value.dueDate[1]}</List.Description>
        <List.Description as='p'>By {value.date}</List.Description>
        </div>
        <div className='FlexColumn'>
           <Icon name='desktop' size='large' color={value.isWorking === true ? 'blue' : 'grey'}
           onClick={() => {this.onClickWorkingIcon(value.id,value.isWorking)}}
           />
           <Icon  name='remove' size='large' color='red'
           onClick={() => {this.onClickRemoveIcon(value.id)}}
           />
           <Icon  name='checkmark' size='large' color='green'
           onClick={() => this.onClicktoMoveRef(value.id)}
           />
        </div>
      </List.Content>
      <Accordion panels={panels(value.textarea)} styled />
    </List.Item>
    )
  }
  renderNEWDOM(value,index){
    return(
      <List.Item key={index}>
      <List.Content className='listContent'>
        <div className='FlexColumn'>
        <List.Header as='h3'>{value.task} - completed</List.Header>
        <List.Description as='p'>{value.dueDate[1]}</List.Description>
        <List.Description as='p'>By {value.date}</List.Description>
        </div>
      </List.Content>
      <Accordion panels={panels(value.textarea)} styled />
    </List.Item>
    )
  }

  render() {
    return (
        <div className='Frontend'>
          <Form>
          <div className='flexRow'>
            <div className='flexColumn'>
              <Label>Task</Label>
              <Input placeholder='Task to do...' type='text'
              value={this.state.task}
              onChange={this.onChangeTask.bind(this)}
              />
            </div>
            <div className='flexColumn'>
                <Label>Due Date</Label>
              <Input type='datetime-local'
              value={this.state.date}
              onChange={this.onChangeDate.bind(this)}
              />
            </div>
            <div className='flexColumn'>
              <Label>Priority</Label>
              <Select placeholder='Select a priority' options={Priority}
              onChange={this.onChangePriority.bind(this)}
              />
            </div>
          </div>
          <div className='flexRow TextArea'>
            <div className='flexColumn TextArea'>
              <Label>Details</Label>
              <TextArea autoHeight placeholder='Write details'
              onChange={this.onChangeTextArea.bind(this)}
              value={this.state.textarea}
               />
            </div>
          </div>
          <Button onClick={this.onClick.bind(this)}>
            Add
          </Button>
          </Form>
          <Select placeholder='filter by' options={filterResult}
          onChange={this.onChangeFilter.bind(this)}
          className='filterSelect'
          />
          <Tab panes={panes(this.props.fetchFirebase.map(this.renderDOM), this.props.newRef.map(this.renderNEWDOM))} />
        </div>
    );
  }
}
function mapStateToProps({fetchFirebase,newRef}) {
  return{fetchFirebase,newRef}
}




export default connect(mapStateToProps,{addFrontEnd,fetchFrontEnd,sortByPriority,updateFrontEnd,removeFrontEnd,workingFrontend,movetoNewRefFrontEnd,fetchfrontEndCompleted})(FRONTENDGOAL);
