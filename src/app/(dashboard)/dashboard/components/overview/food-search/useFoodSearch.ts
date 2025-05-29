import { useState } from 'react';
import { OpenFoodProduct, SavedFoodItem } from './types';

export function useFoodSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFoodResults, setOpenFoodResults] = useState<OpenFoodProduct[]>([]);
  const [communityResults, setCommunityResults] = useState<SavedFoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const fetchOpenFoodFacts = async (query: string) => {
    const response = await fetch(`/api/search-food?productName=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.products || [];
  };

  const fetchCommunityFoods = async (query: string) => {
    const response = await fetch(`/api/shared-nutrition?query=${encodeURIComponent(query)}&limit=10`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setOpenFoodResults([]);
    setCommunityResults([]);
    setSearchError("");

    try {
      const [openFoodData, communityData] = await Promise.all([
        fetchOpenFoodFacts(searchQuery),
        fetchCommunityFoods(searchQuery),
      ]);

      setOpenFoodResults(openFoodData);
      setCommunityResults(communityData);

      if (openFoodData.length === 0 && communityData.length === 0) {
        setSearchError("No results found.");
      }
    } catch (err) {
      setSearchError("An error occurred while searching.");
      setOpenFoodResults([]);
      setCommunityResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    openFoodResults,
    communityResults,
    isSearching,
    searchError,
    handleSearch,
  };
} 