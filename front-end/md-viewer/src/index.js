import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import marked from "marked";
import * as serviceWorker from './serviceWorker';

const placeholder = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`;

marked.setOptions({
  breaks: true
});

const renderer = new marked.Renderer();

class WindowHeader extends React.Component {
  render() {
    return (
      <div className="window-header"><h2>{this.props.name}</h2></div>
    )
  }
}

class EditWindow extends React.Component {
  render() {
    return (
      <div id="edit-window" class="window">
        <WindowHeader name="Editor"/>
        <textarea id="editor" value={this.props.raw} onChange={this.props.textChangeHandler}></textarea>
        <div id="buttons">
          <button id="preview-btn" onClick={this.props.previewHandler}>Preview</button>
          <button id="clear-btn" onClick={this.props.clearHandler}>Clear</button>
        </div>
      </div>
    )
  }
}

class PreviewWindow extends React.Component {
  render() {
    const innerHTML = {__html: marked(this.props.preview, renderer)};
    return (
      <div id="preview-window" class="window">
        <WindowHeader name="Preview"/>
        <div id="preview" dangerouslySetInnerHTML={innerHTML}></div>
      </div>
    )
  }
}

class Wrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      raw: placeholder
    }
  }

  editor_textChange(event) {
    this.setState({
      raw: event.target.value
    })
  }

  previewBtn_click() {
  }

  clearBtn_click() {
    this.setState({
      raw: ""
    });
  }
  
  render() {
    return (
      <div id="wrapper">
        <EditWindow 
          raw={this.state.raw} 
          textChangeHandler={this.editor_textChange.bind(this)} 
          previewHandler={this.previewBtn_click.bind(this)} 
          clearHandler={this.clearBtn_click.bind(this)}/>
        <PreviewWindow preview={this.state.raw}/>
      </div>
    )
  }
}

ReactDOM.render(
  <Wrapper />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();