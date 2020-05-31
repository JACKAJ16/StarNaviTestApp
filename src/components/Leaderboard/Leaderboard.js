import React from 'react';
import './Leaderboard.css';
import axios from "axios";



class Leaderboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  } 
  
  //Fetching leaderboards
  componentDidUpdate() {
    axios.get("https://starnavi-frontend-test-task.herokuapp.com/winners")
      .then(res => 
        this.setState({
        data: res.data
      }))
  }


  render() {
    const { data } = this.state
    return (
      <div className="leaderboard">
      <h1>Leaderboard</h1>
        <ul>
          {data.slice(data.length - 15, data.length).map(val => {
            return(
            <li key={val.id}>
              <div>
                {val.winner}
              </div>
              <div>
               {val.date}
              </div>
            </li>
              )
          } )}
        </ul>
      </div>
    );
  }
}

export default Leaderboard;