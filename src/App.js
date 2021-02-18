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

// The function takes the searchTerm as a param and returns another function,
// because after all the filter function takes a function as its input.
// The returned function has access to the item object because it is the function that is passed to the filter function.
// In addition, the returned function will be used to filter the list based on the condition defined in the function.

const isSearched = (searchTerm) => (
  item //function isSearched(searchTerm) return function(item) return....
) => item.title.toLowerCase().includes(searchTerm.toLowerCase());
// match the incoming searchTerm pattern with the title property of the item from your list.
// includes() return true when the pattern matches and the item stays in the list, the original list in the local state isn’t modified at all.

class App extends Component {
  // App component uses internal state like `this.state` or `this.setState()` and life cycle methods like `constructor()` and `render()`.
  // That’s why it's an ES6 CLASS COMPONENT
  constructor(props) {
    super(
      props
    ); /* sets this.props in your constructor in case you want to access them in the constructor. 
    Otherwise, when accessing this.props in your constructor, they would be undefined. */

    this.state = {
      list: list,
      /* that's ES5, in ES6 it could be just (list,) ``When variable name and the state property name share the same name,
      we can use shorthand`` */
      searchTerm: "",
      //  The input field should be empty in the beginning and thus the value should be an empty string
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    /* if you want to access this.state in your class method, it cannot be retrieved because this is undefined. 
      So in order to make this accessible in your class methods, you have to bind the class methods to this. */
  }

  /* class METHODS can be autobound automatically without
  binding them explicitly by using JavaScript ES6 arrow functions. */
  onDismiss(id) {
    const isNotId = (item) => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList }); //store an updated list to your LOCAL state (internal component state).
  }
  /*   If the evaluation for an item is true, the item stays in the list. Otherwise it will be filtered from the list.
  Additionally, it is good to know that the setState function returns a new list and doesn’t mutate the old list. */

  onSearchChange(event) {
    //The event has the value of the input field in its target object
    this.setState({ searchTerm: event.target.value }); //update the local state with the search term by using this.setState()
  }

  render() {
    const { searchTerm, list } = this.state; // using ES6 destructuring so we can quickly access state's props
    return (
      <div className="App">
        {/*  //## Split Component */}
        <Search value={searchTerm} onChange={this.onSearchChange}>
          Search:
        </Search>
        <Table list={list} pattern={searchTerm} onDismiss={this.onDismiss} />
      </div>
    );
  }
}

// ## Split CLASS COMPONENT Definitions
class Search extends Component {
  render() {
    const { value, onChange, children } = this.props;
    return (
      <form>
        {children} <input type="text" value={value} onChange={onChange} />
        {/* Specifies where the children should be displayed, but it has to be outside of the element.
      After all, it is not only text that you can pass as children. You can pass an element and element trees
      (which can be encapsulated by components again) as children. The children property makes it possible
      to weave components into each other*/}
      </form>
    );
  }
}

// ## refactoring class component to functional stateless component
// const Search = ({ value, onChange, children }) => {
//   //do something else..
//   return (
//     <form>
//       {children} <input type="text" value={value} onChange={onChange} />
//     </form>
//   );
// };

class Table extends Component {
  render() {
    const { list, pattern, onDismiss } = this.props;
    return (
      <div>
        {list.filter(isSearched(pattern)).map((book) => (
          <div key={book.objectID}>
            <span>
              <a href={book.url}>{book.title}</a>
            </span>
            <span>{book.author}</span>
            <span>{book.num_comments}</span>
            <span>{book.points}</span>
            <span>
              <Button onClick={() => onDismiss(book.objectID)}>Dismiss</Button>
              {/* Since you already have a button element, you can use the Button component instead. */}
            </span>
          </div>
        ))}
      </div>
    );
  }
}

class Button extends Component {
  render() {
    const { onClick, children, className = "" } = this.props;
    return (
      <button onClick={onClick} className={className} type="button">
        {children}
      </button>
    );
  }
}

export default App;
