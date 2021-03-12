import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import App from "./App";
import { Search, Button, Table } from "./App";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("App", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  test("has a valid snapshot", () => {
    const component = renderer.create(<App />);
    //creates a snapshot of your App component. It renders it virtually and stores the DOM into a snapshot.
    //Afterward, the snapshot is expected to match the previous snapshot from when you ran your snapshot tests the last time.
    //This way, you can assure that your DOM stays the same and doesn’t change anything by accident.
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Search", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Search>Search</Search>, div);
    ReactDOM.unmountComponentAtNode(div);
  }); //renders the Search component to the DOM and verifies that there is no error during the rendering process
  test("has a valid snapshot", () => {
    const component = renderer.create(<Search>Search</Search>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  // used to store a snapshot of the rendered component and to run it against a previous snapshot.
  // It fails when the snapshot has changed.
});

describe("Button", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Button>Give Me More</Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  test("has a valid snapshot", () => {
    const component = renderer.create(<Button>Give Me More</Button>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Table", () => {
  const props = {
    list: [
      { title: "1", author: "1", num_comments: 1, points: 2, objectID: "x" },
      { title: "2", author: "2", num_comments: 1, points: 2, objectID: "y" },
      { title: "3", author: "3", num_comments: 1, points: 2, objectID: "z" },
    ],
  };
  it("shows three items in list", () => {
    const element = shallow(<Table {...props} />);
    // use shallow() to render your component (without its child components) and check if the element has two elements with the class ~table-row~
    expect(element.find(".table-row").length).toBe(3);
  });
  test("has a valid snapshot", () => {
    const component = renderer.create(<Table {...props} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// Snapshot tests usually stay pretty basic. You only want to cover that the component doesn’t change
// its output. Once it changes the output, you have to decide if you accept the changes. Otherwise you
// have to fix the component when the output is not the desired output.
