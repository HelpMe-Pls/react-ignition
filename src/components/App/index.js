//import logo from "./logo.svg";
import React, { Component } from "react";
import "./index.css";
import axios from "axios";

import * as cnst from "../../constants";
import Search from "../Search";
import Table from "../Table";
import Button from "../Button";

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
      searchTerm: cnst.DEFAULT_QUERY,
      error: null,
      isLoading: false,
      //The initial value of that isLoading property is false. You don’t load anything before the App component is mounted
      //When you make the request, you set a loading state to true
    };

    //this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    //this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this); //fetches results from API when executing a search in the Search component
    this.onDismiss = this.onDismiss.bind(this);
    /* if you want to access this.state in your class method, it cannot be retrieved because this is undefined. 
      So in order to make this accessible in your class methods, you have to bind the class methods to this. */
  }

  /* class METHODS can be autobound automatically without
  binding them explicitly by using JavaScript ES6 arrow functions:
  functionName = () =>{
    do something
  } */

  needsToSearchTopStories = (searchTerm) => {
    return !this.state.results[searchTerm]; //prevent the API request when a result is available in the cache
  };

  setSearchTopStories(result) {
    const { hits, page } = result; // destructured so that later we can access them as {hits} and {page} instead of {result.hits} and {results.page}
    this.setState(cnst.updateSearchTopStoriesState(hits, page));
  }

  fetchSearchTopStories = (searchTerm, page = 0) => {
    //The page argument uses the JavaScript ES6 default parameter to introduce the fallback to page 0 in
    // case no defined page argument is provided for the function.
    this.setState({ isLoading: true });
    axios(
      `${cnst.PATH_BASE}${cnst.PATH_SEARCH}?${cnst.PARAM_SEARCH}${searchTerm}&${cnst.PARAM_PAGE}${page}&${cnst.PARAM_HPP}${cnst.DEFAULT_HPP}`
    )
      .then(
        (result) => this._isMounted && this.setSearchTopStories(result.data)
      )
      //Axios wraps the promise's response into *data* object
      .catch((error) => this._isMounted && this.setState({ error }));
    //store the error object in the local state by using setState().
    //Every time the API request isn’t successful, the catch block would be executed.
    //Instead, the “More” button to fetch more data appears.
    //Once you fetch more data, the button will disappear again and the Loading component will show up.
  };

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

  onSort(sortKey) {
    const isSortReverse =
      this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
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
    const { searchTerm, results, searchKey, error, isLoading } = this.state;
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
          <h1>HackerNews API</h1>
          <hr />
          {/*  //## Split Components */}
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search {/* children */}
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
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

const Loading = () => (
  <div>
    <i>Loading...</i>
  </div>
);
const withLoading =
  (Component) =>
  (
    { isLoading, ...rest } //in this case rest is the ~More~ button component
  ) =>
    isLoading ? <Loading /> : <Component {...rest} />;
const ButtonWithLoading = withLoading(Button);
/* withLoading(Button) is a Higher Order Component with ~ButtonWithLoading~ is an instance of an enhanced output component  */

// class Search extends Component {
//   componentDidMount() {
//     if (this.input) {
//       this.input.focus();
//     }
//   }
//   //focus the input field when the component mounted
//   render() {
//     const { value, onChange, onSubmit, children } = this.props;
//     return (
//       <form onSubmit={onSubmit}>
//         <input
//           type="text"
//           value={value}
//           onChange={onChange}
//           ref={(node) => {
//             this.input = node;
//           }}
//           //The ~ref~ attribute gives you access to a node in your elements
//           //The ~this~ object of an ES6 class component helps us to reference the DOM node with the ref attribute
//         />
//         {/* Specifies where the children should be displayed.
//       After all, it is not only text that you can pass as children. You can pass an element and element trees
//       (which can be encapsulated by components again) as children. The children property makes it possible
//       to weave components into each other*/}
//         <button type="submit">{children}</button>
//       </form>
//     );
//   }
// }

// const Table = ({ list, sortKey, onSort, isSortReverse, onDismiss }) => {
//   const sortedList = SORTS[sortKey](list);
//   const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
//   return (
//     <div className="table">
//       <div className="table-header">
//         <span style={{ width: "40%" }}>
//           <Sort sortKey={"TITLE"} onSort={onSort} activeSortKey={sortKey}>
//             Title
//           </Sort>
//         </span>
//         <span style={{ width: "30%" }}>
//           <Sort sortKey={"AUTHOR"} onSort={onSort} activeSortKey={sortKey}>
//             Author
//           </Sort>
//         </span>
//         <span style={{ width: "10%" }}>
//           <Sort sortKey={"COMMENTS"} onSort={onSort} activeSortKey={sortKey}>
//             Comments
//           </Sort>
//         </span>
//         <span style={{ width: "10%" }}>
//           <Sort sortKey={"POINTS"} onSort={onSort} activeSortKey={sortKey}>
//             Points
//           </Sort>
//         </span>
//         <span style={{ width: "10%" }}>Archive</span>
//       </div>
//       {reverseSortedList.map((post) => (
//         <div key={post.objectID} className="table-row">
//           <span style={largeColumn}>
//             <a href={post.url}>{post.title}</a>
//           </span>
//           <span style={midColumn}>{post.author}</span>
//           <span style={smallColumn}>{post.num_comments}</span>
//           <span style={smallColumn}>{post.points}</span>
//           <span style={smallColumn}>
//             <Button
//               onClick={() => onDismiss(post.objectID)}
//               className="button-inline"
//             >
//               Dismiss
//             </Button>
//             {/* Since you already have a button element, you can use the Button component instead. */}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };
// const largeColumn = {
//   width: "40%",
// };
// const midColumn = {
//   width: "30%",
// };
// const smallColumn = {
//   width: "10%",
// };

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

// the default prop ensures that the property is set to a default value when the parent component didn’t specify it.
// the PropType type check happens after the default prop is evaluated

//On a button click each individual passed sortKey will get setState by the onSort() method.
export default App;
