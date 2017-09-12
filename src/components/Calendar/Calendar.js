import React, { Component } from 'react';
import { Input ,Button ,Label } from 'semantic-ui-react'
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import {connect} from 'react-redux';
import {convertDateandPush,fetchCalendarEvents} from '../../actions';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer



let allViews = Object.keys(BigCalendar.views).map(k => BigCalendar.views[k])
class CALENDAR extends Component {
  constructor(props){
  	super(props);
  	this.state = {
      startDate:'',
      endDate:'',
      title:''
    };
    this.getEvents = this.getEvents.bind(this)
  }
  componentWillMount() {
    this.props.fetchCalendarEvents();
  }
  onChangeStartDate(e){
    this.setState({startDate:e.target.value})
  }
  onChangeEndDate(e){
    this.setState({endDate:e.target.value})
  }
  onChangeTitle(e){
    this.setState({title:e.target.value})
  }
  onClick(e){
    e.preventDefault();
    const {startDate,endDate,title} = this.state;
    let newPromise = new Promise(resolve => {
      resolve(this.props.convertDateandPush(startDate,endDate,title))
    })
    newPromise
    .then(() => {
      this.setState({startDate:'',endDate:'',title:''})
    })
    .then(() => {
        this.props.fetchCalendarEvents();
    })
  }
  getEvents(){
    return this.props.date;
  }
  render() {
      return (
        <div className="Calendar">
        <form>
          <div className='flexColumn'>
          <div className='flexColumn Input'>
            <Label>
              Title
            </Label>
            <Input type="text"
            onChange={this.onChangeTitle.bind(this)}
            value={this.state.title}
            />
          </div>
            <div className='flexColumn Input'>
              <Label>
                Start Time
              </Label>
              <Input type="datetime-local"
              onChange={this.onChangeStartDate.bind(this)}
              value={this.state.startDate}
              />
            </div>
            <div className='flexColumn Input'>
              <Label>
                End Time
              </Label>
              <Input  type="datetime-local"
              onChange={this.onChangeEndDate.bind(this)}
              value={this.state.endDate}
              />
            </div>
          </div>
          <Button
          onClick={this.onClick.bind(this)}>
           Add
         </Button>
        </form>
        <BigCalendar
            events={this.props.date}
            views={allViews}
            defaultDate={new Date()}
          />
        </div>
      );
  }
}
function mapStateToProps({date}) {
  return{date}
}

export default connect(mapStateToProps,{convertDateandPush,fetchCalendarEvents})(CALENDAR);
