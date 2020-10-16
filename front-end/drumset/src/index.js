import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';

const quotes = [
  "This is a quote",
  "This is also a quote",
  "This, too, is a quote",
]

const authors = [
  "Shawn",
  "Also Shawn",
  "Still Shawn"
]

const generateQuote = () => {
  let ind = Math.floor(Math.random() * quotes.length);
  return {
    quote: quotes[ind],
    author: authors[ind]
  };
}

class Quote extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="text">
          <p className="center">{this.props.quote}</p>
      </div>
    )
  }
}

class Author extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="author">
          <p className="center">- {this.props.author}</p>
      </div>
    )
  }
}

class QuoteButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="btn-box">
        <button id="new-quote" className="center" onClick={this.props.handler}>New Quote</button>
      </div>
    )
  }
}

class Social extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="social">
        <p><a id="tweet-quote" className="center" href="twitter.com/intent/tweet">Tweet this quote</a></p>
      </div>
    )
  }
}

class QuoteBox extends React.Component {
  constructor(props) {
    super(props);
    const newQuote = generateQuote();
    this.state = {
      quote: newQuote.quote,
      author: newQuote.author
    }
  }

  quoteButton_click() {
    const newQuote = generateQuote();
    this.setState({
      quote: newQuote.quote,
      author: newQuote.author
    })
  }

  render() {
    return  (
      <div id="quote-box">
        <Quote quote={this.state.quote}/>
        <Author author={this.state.author}/>
        <QuoteButton handler={this.quoteButton_click.bind(this)} />
        <Social />
      </div>
    )
  }
}

ReactDOM.render(
  <QuoteBox />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
