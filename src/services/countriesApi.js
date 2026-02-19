export const fetchCountries = async () => {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flags,cca3"
  )

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des pays")
  }

  return response.json()
}
