//import logo from "./logo.svg";
import React, { Component } from "react";
import "./App.css";

//set up the URL constants and default parameters to breakup the API request into chunks
const DEFAULT_QUERY = "redux";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";

//In JavaScript ES6, you can use template strings to concatenate your URL for the API endpoint
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
console.log(url);

const isSearched = (searchTerm) => (
  item //function isSearched(searchTerm) return function(item) return....
) => item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  // App component uses internal state like `this.state` or `this.setState()` and life cycle methods like `constructor()` and `render()`.
  // That’s why it's an ES6 CLASS COMPONENT
  constructor(props) {
    super(
      props
    ); /* sets this.props in your constructor in case you want to access them in the constructor. 
    Otherwise, when accessing this.props in your constructor, they would be undefined. */

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    /* if you want to access this.state in your class method, it cannot be retrieved because this is undefined. 
      So in order to make this accessible in your class methods, you have to bind the class methods to this. */
  }

  /* class METHODS can be autobound automatically without
  binding them explicitly by using JavaScript ES6 arrow functions. */
  setSearchTopStories(result) {
    this.setState({ result }); //Once the data arrives, it changes your internal component state
  }
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
  // asynchronously fetch data from the Hacker News API
  componentDidMount() {
    const { searchTerm } = this.state;
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`) //It will fetch “redux” related stories, because that is the default parameter
      .then((response) => response.json())
      .then((result) => this.setSearchTopStories(result))
      .catch((error) => error);
  }

  render() {
    const { searchTerm, result } = this.state;
    if (!result) {
      return null;
    }
    return (
      <div className="page">
        <div className="interactions">
          {/*  //## Split Component */}
          <Search value={searchTerm} onChange={this.onSearchChange}>
            Search:
          </Search>
        </div>
        <Table
          list={result.hits}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

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
    const largeColumn = {
      width: "40%",
    };
    const midColumn = {
      width: "30%",
    };
    const smallColumn = {
      width: "10%",
    };
    return (
      <div className="table">
        {list.filter(isSearched(pattern)).map((book) => (
          <div key={book.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={book.url}>{book.title}</a>
            </span>
            <span style={midColumn}>{book.author}</span>
            <span style={smallColumn}>{book.num_comments}</span>
            <span style={smallColumn}>{book.points}</span>
            <span style={smallColumn}>
              <Button
                onClick={() => onDismiss(book.objectID)}
                className="button-inline"
              >
                Dismiss
              </Button>
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
