import Image from "next/image";
import { CalendarDays, Clock, Star, Users } from "lucide-react";
import { TagPill } from "../../components/TagPill";
import Navbar from "../../components/Navbar";
import { use } from "react";

async function getMovie(id) {
  const response = await fetch(
    `https://yts.mx/api/v2/movie_details.json?movie_id=${id}&with_cast=true&with_related=true`
  );
  if (!response.ok) throw new Error("Failed to fetch movie details");
  const data = await response.json();
  return data.data.movie;
}

async function getMovieSuggestions(id) {
  const response = await fetch(
    `https://yts.mx/api/v2/movie_suggestions.json?movie_id=${id}`
  );
  if (!response.ok) return null;
  const data = await response.json();
  return data.data.movies;
}

export default function MovieDetailPage({ params }) {
  const id = use(params).id;
  const movie = use(getMovie(id));
  const suggestions = use(getMovieSuggestions(id));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* Movie Banner */}
      <div className="relative h-[50vh] w-full">
        <Image
          src={movie.background_image}
          alt="Movie Background"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
      </div>

      {/* Movie Details */}
      <div className="relative -mt-40 px-[8vw]">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-64 h-96 relative flex-shrink-0">
            <Image
              src={movie.large_cover_image}
              alt="Movie Poster"
              fill
              className="object-cover rounded-lg shadow-2xl"
              priority
            />
          </div>

          <div className="flex flex-col gap-6 py-4">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <TagPill text={genre} />
              ))}
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <CalendarDays className="text-blue-400" size={20} />
                <span>{movie.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-blue-400" size={20} />
                <span>{movie.runtime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star
                  className="text-yellow-400"
                  fill="currentColor"
                  size={20}
                />
                <span>{movie.rating}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-blue-400" size={20} />
                <span>{movie.like_count} likes</span>
              </div>
            </div>

            <p className="text-gray-300 max-w-3xl">{movie.description_full}</p>

            {/* Trailer Section (if available) */}
            {movie.yt_trailer_code && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Trailer</h2>
                <iframe
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/${movie.yt_trailer_code}`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-lg shadow-lg"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* More Like This Section */}
      <div className="flex flex-col gap-4 mt-8 px-[8vw] pb-10">
        <div className="flex justify-between items-center">
          <span>More Like This</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="flex flex-col gap-2">
              <div className="relative w-full h-96 rounded-xl overflow-hidden">
                <Image
                  src={suggestion.medium_cover_image}
                  alt={suggestion.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-xs">{suggestion.title}</span>
                <div className="flex gap-[4px] items-center">
                  <Star size={16} fill="white" />
                  <span className="text-white font-lato font-bold text-xs">
                    {suggestion.rating}
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
