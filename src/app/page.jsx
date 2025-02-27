"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { TagPill } from "../components/TagPill";
import { CalendarDaysIcon, Clock3Icon, MoveRight, Star } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch("https://yts.mx/api/v2/list_movies.json");
        const data = await response.json();
        setMovies(data.data.movies);
      } catch (error) {
        console.log("Error fetching movies", error);
      }
    }
    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      {movies.length > 0 && (
        <div className="h-[90vh] relative">
          <Image
            src={movies[0].background_image}
            alt="Movie Title"
            fill
            className="object-cover blur-[3px] brightness-75"
          />
          <div className="absolute md:bottom-40 bottom-0 left-4 md:left-20 z-10 flex flex-col gap-2">
            <span className="font-bold text-3xl font-notoSerif">
              {movies[0].title}
            </span>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex gap-2">
                {movies[0].genres.map((genre) => (
                  <TagPill key={genre} text={genre} />
                ))}
              </div>
              <div className="flex gap-4">
                {[
                  {
                    icon: <CalendarDaysIcon size={24} />,
                    text: movies[0].year,
                  },
                  {
                    icon: <Clock3Icon size={24} />,
                    text: `${movies[0].runtime} mins`,
                  },
                  {
                    icon: <Star size={24} fill="white" />,
                    text: movies[0].rating,
                  },
                ].map((item, index) => (
                  <div className="flex gap-[4px] items-center" key={index}>
                    {item.icon}
                    <span className="text-white font-lato font-bold">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <span className="md:w-2/3 font-lato text-sm ">
              {movies[0].description_full}
            </span>
          </div>
        </div>
      )}

      {/* Trending Section Placeholder */}
      <div className="flex flex-col gap-4 mt-8 px-[8vw]">
        <div className="flex justify-between items-center">
          <span>Trending</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {movies.slice(1, 4).map((movie, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="h-60 rounded-xl p-2 relative bg-gray-600">
                <Image
                  src={movie.large_cover_image}
                  alt={movie.title}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <span className="font-bold text-xs">{movie.title}</span>
              <div className="w-full overflow-auto flex gap-2">
                {movie.genres.map((genre) => (
                  <TagPill text={genre} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Release Section Placeholder */}
      <div className="flex flex-col gap-4 mt-8 px-[8vw]">
        <div className="flex justify-between items-center">
          <span>New Release</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {movies.slice(4, 8).map((movie, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="min-h-96 rounded-xl p-2 relative bg-gray-600">
                <Image
                  src={movie.large_cover_image}
                  alt={movie.title}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-xs">{movie.title}</span>
                <div className="flex gap-[4px] items-center">
                  <Star size={16} fill="white" />
                  <span className="text-white font-lato font-bold text-xs">
                    {movie.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
