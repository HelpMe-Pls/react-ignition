import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import App from "../App";

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

// Snapshot tests usually stay pretty basic. You only want to cover that the component doesn’t change
// its output. Once it changes the output, you have to decide if you accept the changes. Otherwise you
// have to fix the component when the output is not the desired output.
