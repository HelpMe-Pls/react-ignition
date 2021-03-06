//import logo from "./logo.svg";
import React, { Component } from "react";
import "./App.css";

//set up the URL constants and default parameters to breakup the API request into chunks
const DEFAULT_QUERY = "react";
const DEFAULT_HPP = "100";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

//In JavaScript ES6, you can use template strings to concatenate your URL for the API endpoint
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;
console.log(url);

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
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this); //fetches results from API when executing a search in the Search component
    this.onDismiss = this.onDismiss.bind(this);
    /* if you want to access this.state in your class method, it cannot be retrieved because this is undefined. 
      So in order to make this accessible in your class methods, you have to bind the class methods to this. */
  }

  /* class METHODS can be autobound automatically without
  binding them explicitly by using JavaScript ES6 arrow functions. */
  setSearchTopStories(result) {
    const { hits, page } = result;
    const oldHits = page !== 0 ? this.state.result.hits : []; //When the page is 0, the hits are empty., start new search request from componentDidMount() or onSearchSubmit()
    const updatedHits = [...oldHits, ...hits]; //merge old and new hits from the recent API equest
    this.setState({
      result: { hits: updatedHits, page }, //set the merged hits and page in the local component state
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    //The page argument uses the JavaScript ES6 default parameter to introduce the fallback to page 0 in
    // case no defined page argument is provided for the function.
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then((response) => response.json())
      .then((result) => this.setSearchTopStories(result))
      .catch((error) => error);
  }

  onDismiss(id) {
    const isNotId = (item) => item.objectID !== id; // all of the remaining items
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updatedHits },
    }); // using spread operator(...) to merge the current result and updatedHits creating a new updated result,
    // for the sake of React's immutable data structures (you shouldn’t mutate an object, or mutate the state directly)
  }

  onSearchChange(event) {
    //The event has the value of the input field in its target object
    this.setState({ searchTerm: event.target.value }); //update the local state with the search term by using this.setState()
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state; //this time with a modified search term from the local state and not with the initial default search term
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  // asynchronously fetch data from the Hacker News API
  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  render() {
    const { searchTerm, result } = this.state;
    // empty page if failed to fetch data
    // if (!result) {
    //   return null;
    // }
    const page = (result && result.page) || 0;
    return (
      <div className="page">
        <div className="interactions">
          {/*  //## Split Component */}
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {result && (
          <Table
            list={
              result.hits // Everything else should be displayed and empty space where the table's at if data fetching is failed
            }
            onDismiss={this.onDismiss}
          />
        )}
        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}
          >
            More
          </Button>
        </div>
      </div>
    );
  }
}

// class Search extends Component {
//   render() {
//     const { value, onChange, children } = this.props;
//     return (
//       <form>
//         {children} <input type="text" value={value} onChange={onChange} />
//         {/* Specifies where the children should be displayed, but it has to be outside of the element.
//       After all, it is not only text that you can pass as children. You can pass an element and element trees
//       (which can be encapsulated by components again) as children. The children property makes it possible
//       to weave components into each other*/}
//       </form>
//     );
//   }
// }

const Search = ({ value, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input type="text" value={value} onChange={onChange} />
    <button type="submit">{children}</button>
  </form>
);

// ## refactoring class component to functional stateless component
// const Search = ({ value, onChange, children }) => {
//   //do something else..
//   return (
//     <form>
//       {children} <input type="text" value={value} onChange={onChange} />
//     </form>
//   );
// };

// class Table extends Component {
//   render() {
//     const { list, pattern, onDismiss } = this.props;
//     const largeColumn = {
//       width: "40%",
//     };
//     const midColumn = {
//       width: "30%",
//     };
//     const smallColumn = {
//       width: "10%",
//     };
//     return (
//       <div className="table">
//         {list.filter(isSearched(pattern)).map((post) => (
//           <div key={post.objectID} className="table-row">
//             <span style={largeColumn}>
//               <a href={post.url}>{post.title}</a>
//             </span>
//             <span style={midColumn}>{post.author}</span>
//             <span style={smallColumn}>{post.num_comments}</span>
//             <span style={smallColumn}>{post.points}</span>
//             <span style={smallColumn}>
//               <Button
//                 onClick={() => onDismiss(post.objectID)}
//                 className="button-inline"
//               >
//                 Dismiss
//               </Button>
//               {/* Since you already have a button element, you can use the Button component instead. */}
//             </span>
//           </div>
//         ))}
//       </div>
//     );
//   }
// }

const Table = ({ list, onDismiss }) => (
  <div className="table">
    {list.map((post) => (
      <div key={post.objectID} className="table-row">
        <span style={largeColumn}>
          <a href={post.url}>{post.title}</a>
        </span>
        <span style={midColumn}>{post.author}</span>
        <span style={smallColumn}>{post.num_comments}</span>
        <span style={smallColumn}>{post.points}</span>
        <span style={smallColumn}>
          <Button
            onClick={() => onDismiss(post.objectID)}
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
const largeColumn = {
  width: "40%",
};
const midColumn = {
  width: "30%",
};
const smallColumn = {
  width: "10%",
};

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
