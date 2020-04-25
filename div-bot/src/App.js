import React, { Component } from "react";

import Pusher from "pusher-js";
import Typist from "react-typist";
import ScrollToBottom from "react-scroll-to-bottom";
import Mascot from "./Mascot.jpg";
import "./App.css";

class App extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = {
      userMessage: "",
      conversation: []
    };
  }

  componentDidMount() {
    const pusher = new Pusher("e0483e3186a2fcbed27f", {
      cluster: "us2",
      encrypted: true
    });

    const channel = pusher.subscribe("bot");
    channel.bind("bot-response", data => {
      const msg = {
        text: data.message,
        user: "ai"
      };
      this.setState({
        conversation: [...this.state.conversation, msg]
      });
    });
  }

  handleChange = event => {
    this.setState({ userMessage: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (!this.state.userMessage.trim()) return;

    const msg = {
      text: this.state.userMessage,
      user: "human"
    };

    this.setState({
      conversation: [...this.state.conversation, msg]
    });

    fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: this.state.userMessage
      })
    });

    this.setState({ userMessage: "" });
  };

  render() {
    const ChatBubble = (text, i, className) => {
      return (
        <div key={`${className}-${i}`} className={`${className} chat-bubble`}>
          <span className="chat-content">{text}</span>
        </div>
      );
    };

    const chat = this.state.conversation.map((e, index) =>
      ChatBubble(e.text, index, e.user)
    );

    return (
      <div className="App">
        <div className="description">
          <Typist cursor={{ show: false }}>
            <h1>Learn to code with DivBot!</h1>
          </Typist>
          <p>
            A chatbot that helps you learn how to program! Whether you are a new
            to computer science or just looking to practice for coding
            interviews, Divbot can be your new best friend.
          </p>

          <p>
            Divbot is a coding interview ninja who is able to quiz you on
            interviewers' favorite fundamental computer science topics (Ex. what
            is the Big-O of merge-sort?). Also, if you don't know where to start
            with your coding education, DivBot can recommend you helpful
            resources based on what you are looking to achieve.
          </p>
          <p>Start by saying hi to DivBot!</p>
          <h2>Divbot was built using Dialogflow and React.js</h2>
          <h2>
            Created By: Dahee Kwon, Damin Jung, and Vincent Huang for DivHacks
            2019
          </h2>
        </div>

        <div className="chat-section">
          <div className="bot-box">
            <div className="bot-profile">
              <img className="prof" src={Mascot} alt="" />
              <p> DivBot </p>
            </div>
            <ScrollToBottom className="conversation-view">
              {chat}
            </ScrollToBottom>
            <div className="message-box">
              <form onSubmit={this.handleSubmit}>
                <input
                  value={this.state.userMessage}
                  readOnly={false}
                  onInput={this.handleChange}
                  className="text-input"
                  type="text"
                  autoFocus
                  placeholder="Type your message and hit Enter to send"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
