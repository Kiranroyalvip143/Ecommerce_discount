import { React, useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [search, setSearch] = useState("");
  function handleSearch() {
    onSearch(search);
  }
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="search products..."
        value={search}
        onChage={(e) => setSearch(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
