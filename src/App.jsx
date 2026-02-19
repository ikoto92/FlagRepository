import React, { useEffect, useState } from "react"
import { fetchCountries } from "./services/countriesApi"
import SearchBar from "./components/SearchBar"
import ColorFilter from "./components/ColorFilter"
import FlagList from "./components/FlagList"

const COLOR_RANGES = {
  red: (r, g, b) => r > 150 && g < 100 && b < 100,
  green: (r, g, b) => g > 150 && r < 120 && b < 120,
  blue: (r, g, b) => b > 150 && r < 120 && g < 120,
  yellow: (r, g, b) => r > 150 && g > 150 && b < 120,
  black: (r, g, b) => r < 60 && g < 60 && b < 60,
  white: (r, g, b) => r > 200 && g > 200 && b > 200,
}

function App() {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedColors, setSelectedColors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const cached = localStorage.getItem("flagColors")

      const data = await fetchCountries()

      if (cached) {
        const parsed = JSON.parse(cached)
        const enriched = data.map((country) => ({
          ...country,
          detectedColors: parsed[country.cca3] || [],
        }))
        setCountries(enriched)
        setLoading(false)
        return
      }

   
      const colorDatabase = {}
      const enriched = []

      for (const country of data) {
        const colors = await extractColors(country.flags.png)
        colorDatabase[country.cca3] = colors
        enriched.push({
          ...country,
          detectedColors: colors,
        })
      }

      localStorage.setItem("flagColors", JSON.stringify(colorDatabase))

      setCountries(enriched)
      setLoading(false)
    }

    loadData()
  }, [])

  const extractColors = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = "Anonymous"
      img.src = imageUrl

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        canvas.width = 40
        canvas.height = 25
        ctx.drawImage(img, 0, 0, 40, 25)

        const { data } = ctx.getImageData(0, 0, 40, 25)

        const foundColors = new Set()

        for (let i = 0; i < data.length; i += 50) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          Object.entries(COLOR_RANGES).forEach(([color, fn]) => {
            if (fn(r, g, b)) {
              foundColors.add(color)
            }
          })
        }

        resolve([...foundColors])
      }

      img.onerror = () => resolve([])
    })
  }

  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    if (selectedColors.length === 0) {
      return matchesSearch
    }

    
    const matchesColor = selectedColors.every((color) =>
      country.detectedColors.includes(color)
    )

    return matchesSearch && matchesColor
  })

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        🌍 Flag Repository
      </h1>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <ColorFilter
          selectedColors={selectedColors}
          setSelectedColors={setSelectedColors}
        />
      </div>

      {loading && (
        <p className="text-center mt-8">
          Analyse des drapeaux (1 seule fois)...
        </p>
      )}

      {!loading && (
        <FlagList countries={filteredCountries} />
      )}
    </div>
  )
}

export default App
