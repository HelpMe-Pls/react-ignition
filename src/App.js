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
        <form>
          {/* you will type into the input field and filter the list temporarily by the
          search term that is used in the input field (stored in your local state) */}
          <input type="text" onChange={this.onSearchChange} />
          {/* TODO: figure out why () => this.onSearchChange won't work */}
        </form>
        {list
          .filter(isSearched(searchTerm))
          // You pass in the searchTerm property from your local state, it returns the filter input function, and filters your
          // list based on the filter condition. Afterward it MAPS over the filtered list TO DISPLAY an element for each list item.
          .map((book) => (
            <div key={book.objectID}>
              <span>
                <a href={book.url}>{book.title}</a>
              </span>
              <span>{book.author}</span>
              <span>{book.num_comments}</span>
              <span>{book.points}</span>
              <span>
                <button
                  onClick={
                    () => this.onDismiss(book.objectID) // it has to be a function (arrow func) that is passed to the event handler, and the return of that arrow func is sth you intended.
                  } //Without it, the class method would be executed immediately when you run the app. The concept is called higher-order functions in JavaScript
                  value={searchTerm} // added for the sake of controlled component
                  type="button"
                >
                  Dismiss
                </button>
              </span>
            </div>
          ))}
      </div>
    );
  }
}

export default App;

/* What you experience now is the unidirectional data flow in React.
You trigger an action in your view with onClick(), a function or class method modifies
the internal component state
and the render() method of the component runs again to update the view. */
