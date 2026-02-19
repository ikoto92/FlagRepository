import React from "react"
import FlagCard from "./FlagCard"

const FlagList = ({ countries }) => {
  if (countries.length === 0) {
    return <p className="text-center mt-8">Aucun pays trouvé.</p>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
      {countries.map((country) => (
        <FlagCard key={country.cca3} country={country} />
      ))}
    </div>
  )
}

export default FlagList
