//import logo from "./logo.svg";
import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import PropTypes from "prop-types";

//set up the URL constants and default parameters to breakup the API request into chunks
const DEFAULT_QUERY = "react";
const DEFAULT_HPP = "100";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

class App extends Component {
  // App component uses internal state like `this.state` or `this.setState()` and life cycle methods like `constructor()` and `render()`.
  // That’s why it's an ES6 CLASS COMPONENT
  _isMounted = false; //avoid calling this.setState() in React on an unmounted component
  constructor(props) {
    super(
      props
    ); /* sets this.props in your constructor in case you want to access them in the constructor. 
    Otherwise, when accessing this.props in your constructor, they would be undefined. */

    this.state = {
      results: null,
      searchKey: "",
      /* The searchKey has to be set before each request is made and reflects the searchTerm (is a fluctuant variable,
      because it gets changed every time you type into the Search input field)
      We use searchKey to determine the recent submitted search term to the API and to retrieve the correct result from the map of results.
      It is a pointer to your current result in the cache and thus can be used to display the current result in your render() method. */
      searchTerm: DEFAULT_QUERY,
      error: null,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
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

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm]; //prevent the API request when a result is available in the cache
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    /* The searchKey will be used as the key to save the updated hits and page in a results map.
    First, you have to retrieve the searchKey from the component state. Remember that the searchKey gets set on componentDidMount() and onSearchSubmit(). */
    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];
    /* Second, the old hits have to get merged with the new hits as before. But this time the old hits get
    retrieved from the results map with the searchKey as key. */
    const updatedHits = [...oldHits, ...hits]; //merge old and new hits from the recent API equest
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }, //makes sure to store the updated result by searchKey (the most recent search term)
      },
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    //The page argument uses the JavaScript ES6 default parameter to introduce the fallback to page 0 in
    // case no defined page argument is provided for the function.
    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(
        (result) => this._isMounted && this.setSearchTopStories(result.data)
      )
      //Axios wraps the promise's response into *data* object
      .catch((error) => this._isMounted && this.setState({ error }));
    //store the error object in the local state by using setState(). Every time the API request isn’t successful, the catch block would be executed.
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const isNotId = (item) => item.objectID !== id; // all of the remaining items
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page },
      },
    }); // using spread operator(...) to merge the current result and updatedHits creating a new updated result,
    // for the sake of React's immutable data structures (you shouldn’t mutate an object, or mutate the state directly)
  }

  onSearchChange(event) {
    //The event has the value of the input field in its target object
    this.setState({ searchTerm: event.target.value }); //update the local state with the search term by using this.setState()
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state; //this time with a modified search term from the local state and not with the initial default search term
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm); //Now your client makes a request to the API only once although you search for a search term twice.
    }

    event.preventDefault();
  }

  // asynchronously fetch data from the Hacker News API
  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { searchTerm, results, searchKey, error } = this.state;
    // empty page if failed to fetch data
    // if (!result) {
    //   return null;
    // }
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

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
        {error ? (
          <div className="interactions">
            <p>Something went wrong.</p>
          </div>
        ) : (
          <Table list={list} onDismiss={this.onDismiss} />
        )}
        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
            //Use searchKey otherwise your paginated fetch depends on the searchTerm value which is fluctuant
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

// class Button extends Component {
//   render() {
//     const { onClick, children, className = "" } = this.props;
//     return (
//       <button onClick={onClick} className={className} type="button">
//         {children}
//       </button>
//     );
//   }
// }

const Button = ({ onClick, className, children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);
Button.defaultProps = {
  //internal React default prop
  className: "",
};
Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
// the default prop ensures that the property is set to a default value when the parent component didn’t specify it.
// the PropType type check happens after the default prop is evaluated

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default App;

export { Button, Search, Table };
