import React from "react"

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="w-full md:w-1/2">
      <input
        type="text"
        placeholder="Rechercher un pays..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  )
}

export default SearchBar
