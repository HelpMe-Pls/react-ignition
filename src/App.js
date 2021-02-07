//import logo from "./logo.svg";
import React, { Component } from "react";
import "./App.css";

const list = [
  {
    title: "React",
    url: "https://facebook.github.io/react/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://github.com/reactjs/redux",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

class App extends Component {
  //function App() {
  constructor(props) {
    super(
      props
    ); /* sets this.props in your constructor in case you want to access them in the constructor. 
    Otherwise, when accessing this.props in your constructor, they would be undefined. */
    this.state = {
      list: list,
      /* that's ES5, in ES6 it could be just (list,) ``When variable name and the state property name share the same name,
      we can use shorthand`` */
    };
  }

  render() {
    return (
      <div className="App">
        {this.state.list.map((item) => (
          <div key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default App;

/* ## Object initializer

An object initializer is an expression that describes the initialization of an Object. Objects consist of properties,
which are used to describe an object. The values of object properties can either contain primitive data types or other objects.

# Object literal notation vs JSON
The object literal notation is not the same as the JavaScript Object Notation (JSON). Although they look similar,
there are differences between them:

- JSON permits only property definition using "property": value syntax.  The property name must be double-quoted, and the definition
cannot be a shorthand.
- In JSON the values can only be strings, numbers, arrays, true, false, null, or another (JSON) object.
- A function value can not be assigned to a value in JSON, but you can have a function as a property's value in object literal notation.
- Objects like Date will be a string after JSON.parse().
- JSON.parse() will reject computed property names and an error will be thrown. */
