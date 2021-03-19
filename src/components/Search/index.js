const Search = ({ value, onChange, onSubmit, children }) => {
  let input;
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        ref={(node) => (input = node)}
      />
      <button type="submit">{children}</button>
    </form>
  );
};

export default Search;
