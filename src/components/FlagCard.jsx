import React from "react"

const FlagCard = ({ country }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:scale-105 transition duration-200">
      <img
        src={country.flags.png}
        alt={country.name.common}
        className="w-full h-32 object-cover"
      />
      <div className="p-3 text-center font-medium">
        {country.name.common}
      </div>
    </div>
  )
}

export default FlagCard
