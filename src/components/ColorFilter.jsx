import React from "react"

const COLORS = ["red", "blue", "green", "yellow", "black", "white"]

const ColorFilter = ({ selectedColors, setSelectedColors }) => {
  const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color))
    } else {
      setSelectedColors([...selectedColors, color])
    }
  }

  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {COLORS.map((color) => (
        <label key={color} className="flex items-center gap-2 capitalize">
          <input
            type="checkbox"
            checked={selectedColors.includes(color)}
            onChange={() => toggleColor(color)}
          />
          {color}
        </label>
      ))}
    </div>
  )
}

export default ColorFilter
