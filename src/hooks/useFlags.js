import { useState, useEffect } from 'react';

const useFlags = () => {
  const [flags, setFlags] = useState([]);
  const [filteredFlags, setFilteredFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);

  useEffect(() => {
    let isMounted = true; // Pour éviter les fuites mémoire

    const fetchFlags = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Tentative de chargement...');
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,flags,cca3'
        );
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Données reçues:', data.length);
        
        if (isMounted) {
          // Trier par nom de pays
          const sortedData = [...data].sort((a, b) => 
            a.name.common.localeCompare(b.name.common)
          );
          
          setFlags(sortedData);
          setFilteredFlags(sortedData);
        }
      } catch (err) {
        console.error('Erreur:', err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFlags();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtrer par nom
  useEffect(() => {
    let result = flags;

    if (searchTerm) {
      result = flags.filter(flag =>
        flag?.name?.common?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFlags(result);
  }, [searchTerm, flags]);

  return {
    flags: filteredFlags,
    allFlags: flags,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedColors,
    setSelectedColors
  };
};

export default useFlags;