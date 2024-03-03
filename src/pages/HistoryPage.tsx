import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const accessKey = "8odbcWMjbrbIQNaomRBZSmIdlFgUFFKO6EECa_M7s9I";
const apiUrl = "https://api.unsplash.com";

interface Photo {
  id: string;
  downloads: number;
  likes: number;
  views: number;
  urls: {
    full: string;
    raw: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  width: number;
  height: number;
}

function HistoryPage() {
  const [searchword, setsearchWord] = useState<string>("");
  const [history, setHistory] = useState([]);

  const [page, setPage] = useState(1);

  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const existingSearchTerms = JSON.parse(
      localStorage.getItem("searchTerms")!
    ).filter((term: string) => term.trim() !== "");
    setHistory(existingSearchTerms);
  }, []);

  const { data, error, isPending, isLoading, isError } = useQuery({
    queryKey: ["photo", searchword],
    queryFn: async () => {
      //if (searchword === null) return [];
      if (!searchword) return [];
      try {
        console.log(searchword);
        const response = await axios.get(
          `${apiUrl}/search/photos?page=1&per_page=20&query=${searchword}`,
          {
            headers: { Authorization: `Client-ID ${accessKey}` },
          }
        );
        console.log(response.data.results);
        return response.data.results; // Return the data from the Promise
      } catch (err: any) {
        throw new Error(err.response.data); // Throw any caught errors
      }
    },
  });

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>ეს არის ისტრიის გვერდი</h1>
      <Link to="/მთავარი">მთავარი</Link>
      <ul>
        {history.map((word, index) => (
          <li
            key={index}
            onClick={() => (console.log(word), setsearchWord(word))}
            className="   link:text-purple-600 visited:text-purple-600 hover:text-purple-600 active:text-purple-600"
          >
            {word}
            {isLoading && <p>{isPending}</p>}
            {isError && <p>{isError}</p>}
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-4 gap-1">
        {data &&
          data.map((photo: Photo) => (
            <img
              key={photo.id}
              src={photo.urls.regular}
              alt={photo.alt_description}
            />
          ))}
      </div>
    </div>
  );
}

export default HistoryPage;

/*
queryFn: () =>
      axios
        .get(`${apiUrl}/photos?per_page=20&query=${searchword}`, {
          headers: { Authorization: `Client-ID ${accessKey}` },
        })
        .then((res) => {
          console.log(res.data);
          return res.data;
        }),*/
