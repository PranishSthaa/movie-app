"use client";

import React, { useRef, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchInput = (query) => {
    setSearchQuery(query);
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://yts.mx/api/v2/list_movies.json?query_term=${searchQuery}`
        );

        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setSearchResults(data.data.movies || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch results. Please try again.");
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleMovieClick = (movieId) => {
    router.push(`/${movieId}`);
    clearSearch();
  };

  return (
    <div className="h-[10vh] px-6 flex justify-between items-center bg-gray-800 text-white">
      <div className="flex gap-8">
        <Link href="/" className="text-xl font-semibold hover:text-gray-300">
          Home
        </Link>
      </div>

      <div className="relative" ref={searchRef}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              className="w-64 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={clearSearch}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
            onClick={handleSearch}
          >
            <Search size={18} />
            Search
          </button>
        </div>

        {/* Placeholder Search Results */}
        {searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-[400px] max-h-[70vh] overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
            {searchResults.map((movie, index) => (
              <div
                className="flex items-center gap-3 p-3 border-b border-gray-700 hover:bg-gray-700 hover:cursor-pointer"
                key={index}
                onClick={() => handleMovieClick(movie.id)}
              >
                <div className="w-12 h-16 bg-gray-600 rounded relative">
                  <Image
                    src={movie.large_cover_image}
                    alt={movie.title}
                    fill
                    className="rounded object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{movie.title}</h3>
                  <p className="text-sm text-gray-400">
                    {movie.year} • {movie.rating}/10
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Placeholder Loading State */}
        {isLoading && (
          <div className="absolute top-full mt-2 w-[400px] p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl text-center">
            <div className="text-blue-500">Loading Placeholder...</div>
          </div>
        )}

        {/* Placeholder Error State */}
        {error && (
          <div className="absolute top-full mt-2 w-[400px] p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
