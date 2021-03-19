import renderer from "react-test-renderer";
import Table from "../Table";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("Table", () => {
  const props = {
    list: [
      { title: "1", author: "1", num_comments: 1, points: 2, objectID: "x" },
      { title: "2", author: "2", num_comments: 1, points: 2, objectID: "y" },
      { title: "3", author: "3", num_comments: 1, points: 2, objectID: "z" },
    ],
    sortKey: "TITLE",
    isSortReverse: false,
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
