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

// The function takes the searchTerm and returns another function, because after all the filter function
// takes a function as its input. The returned function has access to the item object because it is the
// function that is passed to the filter function. In addition, the returned function will be used to filter
// the list based on the condition defined in the function.
const isSearched = (searchTerm) => (
  item //function isSearched(searchTerm) return function(item) return....
) => item.title.toLowerCase().includes(searchTerm.toLowerCase());
//match the incoming searchTerm pattern with the title property of the item from your list

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
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    /* if you want to access
      this.state in your class method, it cannot be retrieved because this is undefined. So in order to
      make this accessible in your class methods, you have to bind the class methods to this. */
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
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    return (
      <div className="App">
        <form>
          <input type="text" onChange={this.onSearchChange} />
          {/* you will type into the input field and filter the list temporarily by the
          search term that is used in the input field (stored in your local state) */}
        </form>
        {this.state.list
          .filter(isSearched(this.state.searchTerm))
          // You pass in the searchTerm property from your local state, it returns the filter input function, and filters your
          // list based on the filter condition. Afterward it maps over the filtered list to display an element for each list item.
          .map((item) => (
            <div key={item.objectID}>
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
              <span>
                <button
                  onClick={
                    () => this.onDismiss(item.objectID) // it has to be a function (arrow func) that is passed to the event handler, and the return of that arrow func is sth you intended.
                  } //Without it, the class method would be executed immediately when you run the app. The concept is called higher-order functions in JavaScript
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
