import React from 'react';
import './App.css';
import Game from "./components/Game/Game"
import Leaderboard from "./components/Leaderboard/Leaderboard"
import axios from "axios"


let z = 0;
let ranNums = [];
let arr = [];
let interval

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      computer: 0,
      player: 0,
      id: "",
      field: "",
      style: "",
      data: "",
      disabled: true,
      option: false,     
      play: "Play",
      delay: "",
      value: "PickMode"
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleRandom = this.handleRandom.bind(this)
    this.handlePlayerClick = this.handlePlayerClick.bind(this)
    this.handleRed = this.handleRed.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.inputHandle = this.inputHandle.bind(this)
    this.handleNewGame = this.handleNewGame.bind(this)
  } 



  
  componentDidMount() {
    axios.get("https://starnavi-frontend-test-task.herokuapp.com/game-settings")
      .then(res => 
        this.setState({
          data: res.data
        }))

    this.handleDate()

    //Making array not empy right away so user can see first difficulty field on the screen at the start
    for(let c = 1; c < 26; c++) {
      arr.push(c)
    }
  }

  //Getting current date and time
  handleDate() {
    let today = new Date();
    let dd = today.getDate();
    let yyyy = today.getFullYear();
    const mm = today.toLocaleString('en-us', { month: 'long' });
    let min = (today.getMinutes() < 10 ? "0" : "") + today.getMinutes();
    let hour = (today.getHours() < 10 ? "0" : "") + today.getHours();
    today = hour + ":" + min + " " + dd + " " + mm + ' ' + yyyy;
    this.setState({
     date: today
    })
  }

  //Launching random numbers array method and setting interval for making random button blue color method
  handleSubmit(e) {  
    z = 0;
    e.preventDefault()
    this.randomNums()
    interval = setInterval(this.handleRandom, this.state.delay * 2);
    this.setState({
      disabled: true,
      option: true,
      computer: 0,
      player: 0,
      winner: ""
    })
    this.handleNewGame()
  }
  
  //Making all buttons original color after the game is done and player managed to change difficulty
  handleNewGame() {
    for(let b = 1; b < arr.length; b++) {
    if(document.getElementById(b).style.background === "lightblue" || document.getElementById(b).style.background === "red" || document.getElementById(b).style.background === "green") {
      document.getElementById(b).style.background = "#f9f9f9"
      }
    }
  }

  //Making random non repeating numbers array
  randomNums() {
    let nums = [];

    for(var a = 1; a <= this.state.field; a++) {
      nums.push(a)
    }

    let i = nums.length,
    j = 0;

    while (i--) {
    j = Math.floor(Math.random() * (i+1));

    ranNums.push(nums[j]);
    nums.splice(j,1);

    }
  }


  
  //Making random button blue color and then red if it wasn't clicked
  handleRandom() {
    z++;  
    let p = ranNums[z];

    if(this.state.computer < this.state.field / 2 + 0.5 && this.state.player < this.state.field / 2 + 0.5) {
      this.setState({
      id: p
    }, function() {
      document.getElementById(this.state.id ? this.state.id : 1).style.background = 'lightblue'
    })
    setTimeout(this.handleRed, this.state.delay)
    }



  //Clearing interval, setting winner on the screen, POST request right after someone's win
  if(this.state.computer > this.state.field / 2 || this.state.player > this.state.field / 2) {
      setTimeout(() => {clearInterval(interval)}, 0)
      this.setState({
        winner: this.state.computer > this.state.player ? "Computer" : this.state.playerName,
        play: "Play again",
        disabled: false,
        option: false
      })
      this.handlePost()
    }
  }


  //Making button red if player didn't clicked it
  handleRed() {
      if(document.getElementById(this.state.id).style.background === 'lightblue') { 
      document.getElementById(this.state.id).style.background = 'red'
      this.setState({
       computer: this.state.computer  + 1,
      })
        console.log("Computer: " + this.state.computer)

      }
    }


  //POST method 
  handlePost() {
    axios.post('https://starnavi-frontend-test-task.herokuapp.com/winners', {
          winner: this.state.winner,
          date: this.state.date
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      }

  //Making button green if player clicked in time
  handlePlayerClick(e) {
   if(document.getElementById(e.target.id).style.background === "lightblue") {
       document.getElementById(e.target.id).style.background = "green";
       this.setState({
        player: this.state.player + 1,
        computer: this.state.computer 
      }, () => {
        console.log("Player: " + this.state.player);
      })
    }
  }

  //Changing difficulty by selecting options in the form
  handleChange(e) {
    z = 0;
    this.setState({
      field: this.state.data[e.target.value].field * this.state.data[e.target.value].field,
      delay: this.state.data[e.target.value].delay,
      disabled: false,
      value: e.target.value
      }, () => {
        if(arr[0] !== undefined) {
        arr.splice(0, arr.length)
        for(let a = 1; a  <= this.state.field; a++) {
          arr.push(a)
          }
        } 

        if(this.state.field === 25) {
          this.setState({
          style: "205px"
        })
        } else if(this.state.field === 100) {
          this.setState({
          style: "405px"
        })
        } else if(this.state.field === 225) {
          this.setState({
          style: "605px"
        })
      }  
    })

    this.handleNewGame()
  
  ranNums.splice(0, ranNums.length)    

}
    
  //Handling player name input 
  inputHandle(e) {
    this.setState({
      playerName: e.target.value
    })
  }
  



  render() {
    return (
      <div className="App">
        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
           <select value={this.state.value} disabled={this.state.option} onChange={this.handleChange}>
              <option value="PickMode" hidden>
                Pick game mode
              </option>
              <option value="easyMode">
                Easy
              </option>
              <option value="normalMode">
                Normal
              </option>
              <option value="hardMode">
                Hard
              </option>
            </select>
            <input onChange={this.inputHandle} required disabled={this.state.option} type="text" placeholder="Enter your name"/>
            <button className="play" disabled={this.state.disabled}>{this.state.play}</button>
          </form>
          <p>Winner is: {this.state.winner}</p>
          <Game style={this.state.style} arr={arr} handlePlayerClick={this.handlePlayerClick}/>
        </div>
        <Leaderboard />
      </div>
    );
  }
}

export default App;
