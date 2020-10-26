import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';

const PAD_INFO = [
  {char: "Q", keyNum: 81, url: "https://freesound.org/data/previews/0/428_196-lq.mp3", name: "Kick"}, 
  {char: "W", keyNum: 87, url: "https://freesound.org/data/previews/34/34828_209299-lq.mp3", name: "Snare"}, 
  {char: "E", keyNum: 69, url: "https://freesound.org/data/previews/0/428_196-lq.mp3", name: "Kick"}, 
  {char: "A", keyNum: 65, url: "https://freesound.org/data/previews/0/428_196-lq.mp3", name: "Kick"}, 
  {char: "S", keyNum: 83, url: "https://freesound.org/data/previews/0/428_196-lq.mp3", name: "Kick"}, 
  {char: "D", keyNum: 68, url: "https://freesound.org/data/previews/0/428_196-lq.mp3", name: "Kick"}, 
  {char: "Z", keyNum: 90, url: "https://freesound.org/data/previews/0/428_196-lq.mp3", name: "Kick"}, 
  {char: "X", keyNum: 88, url: "https://freesound.org/data/previews/0/428_196-lq.mp3", name: "Kick"}, 
  {char: "C", keyNum: 67, url: "https://freesound.org/data/previews/0/428_196-lq.mp3", name: "Kick"}
];

class DrumButton extends React.Component {
  constructor(props) {
    super(props);

    this.button_click = this.button_click.bind(this);
    this.key_press = this.key_press.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.key_press);
  }

  button_click() {
    this.playSound()
  }

  key_press(e) {
    if (e.keyCode === this.props.keyNum)
      this.playSound();
  }

  playSound() {
    const audio = document.getElementById(this.props.char);
    audio.currentTime = 0;
    audio.play();
  }

  render() {
    const buttonId = "drum-" + this.props.char;
    return (
      <button id={buttonId} className="drum-pad" onClick={this.button_click}>
        {this.props.char}
        <audio id={this.props.char} className="clip" src={this.props.url}></audio>
      </button>
    )
  }
}

class Control extends React.Component {
  render() {
    return (
      <div><p>ipsum lorem</p></div>
    )
  }
}

class Display extends React.Component {
  render() {
    let buttons = this.props.pads.map(
      (item, key) => (<DrumButton key={key} char={item.char} keyNum={item.keyNum} url={item.url}/>)
    );

    return (
      <div id="display">
        <div id="button-group">
          {buttons}
        </div>
        <div id="control-group">
          <Control />
        </div>
      </div>
    )
  }
}

class DrumMachine extends React.Component {
  constructor(props) {
    super(props);

   this.state = {

    };
  }
  
  render() {
    return (
      <div id="drum-machine">
        <Display pads={PAD_INFO}/>
      </div>
    );
  }
}

ReactDOM.render(
  <DrumMachine />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
