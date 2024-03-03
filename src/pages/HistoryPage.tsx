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

  const [showModal, setSowModal] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo>();

  useEffect(() => {
    const existingSearchTerms = JSON.parse(
      localStorage.getItem("searchTerms")!
    ).filter((term: string) => term.trim() !== "");
    setHistory(existingSearchTerms);
  }, []);

  const { data, error, isPending, isLoading, isError } = useQuery({
    queryKey: ["photo", searchword, page],
    queryFn: async () => {
      //if (searchword === null) return [];
      if (!searchword) return [];
      try {
        console.log(searchword);
        const response = await axios.get(
          `${apiUrl}/search/photos?page=${page}&per_page=20&query=${searchword}`,
          {
            headers: { Authorization: `Client-ID ${accessKey}` },
          }
        );
        console.log(response.data.results);
        setAllPhotos((prevPhotos) => [...prevPhotos, ...response.data.results]);
        return response.data.results; // Return the data from the Promise
      } catch (err: any) {
        throw new Error(err.response.data); // Throw any caught errors
      }
    },
  });

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight &&
      !isLoading &&
      !isError &&
      data.length >= 20
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, isError, page]);

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="px-6 pt-4">
      <p className="py-4">
        დაბრუნდი <Link to="/მთავარი">მთავარზე</Link>
      </p>

      <ul>
        {history.map((word, index) => (
          <li
            key={index}
            onClick={() => (
              console.log(word), setsearchWord(word), setAllPhotos([])
            )}
            className="   link:text-purple-600 visited:text-purple-600 hover:text-purple-600 active:text-purple-600"
          >
            {word}
            {isLoading && <p>{isPending}</p>}
            {isError && <p>{isError}</p>}
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-4 gap-1">
        {allPhotos.map((photo: Photo) => (
          <img
            key={photo.id}
            src={photo.urls.regular}
            alt={photo.alt_description}
            onClick={() => (setSowModal(!showModal), setSelectedPhoto(photo))}
          />
        ))}
      </div>
      {showModal && (
        <div
          className="flex gap-4 items-center   fixed top-0 left-0 bg-black bg-opacity-90"
          onClick={() => setSowModal(false)}
        >
          <img
            className="w-[60%] h-[60%]"
            src={selectedPhoto?.urls.regular}
            alt={selectedPhoto?.alt_description}
          />
          <div
            className="text-white
          "
          >
            <p>likes: {selectedPhoto?.likes}</p>
            <p>views: {selectedPhoto?.views}</p>
            <p>downloads: {selectedPhoto?.downloads}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
