import React from 'react';
import './Game.css';



const Game = (props) => {

  
    return (
      <div style={{width: props.style}} className="buttons">
        {props.arr.map((val, index) => {
          return (
          <button onClick={props.handlePlayerClick} key={val.toString()} id={index + 1}></button>
            )
        })}
      </div>
    );
  }



export default Game;