import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
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

function MainPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);

  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);

  const [showModal, setSowModal] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo>();

  const { data, error, isPending, isLoading, isError } = useQuery({
    queryKey: ["photos", debouncedSearchTerm, page],
    queryFn: async () => {
      if (searchTerm.trim() === "") {
        return await axios
          .get(`${apiUrl}/photos?page=${page}&per_page=20&order_by=popular`, {
            headers: { Authorization: `Client-ID ${accessKey}` },
          })
          .then((res) => {
            console.log("page: ", page);
            console.log("2", debouncedSearchTerm);

            setAllPhotos((prevPhotos) => [...prevPhotos, ...res.data]);
            return res.data;
          });
      } else {
        if (debouncedSearchTerm) {
          return await axios

            .get(
              `https://api.unsplash.com/search/photos/?client_id=${accessKey}&page=${page}&per_page=20&query=${debouncedSearchTerm}`
            )
            .then((res) => {
              console.log("page: ", page);
              console.log("3", debouncedSearchTerm);
              console.log(res.data.results);
              setAllPhotos((prevPhotos) => [
                ...prevPhotos,
                ...res.data.results,
              ]);
              return res.data.results;
            });
        }
      }
    },
    //keepPreviousData: true,
    placeholderData: keepPreviousData,
    //
    //refetchOnWindowFocus: false,
  });

  //*** */
  useEffect(() => {
    if (data && page === 1) {
      console.log(allPhotos);
      setAllPhotos(data);
    } else if (data && page > 1) {
      console.log(allPhotos);

      //setAllPhotos((prevPhotos) => [...prevPhotos, ...uniquePhotos]);
      setAllPhotos((prevPhotos) => [...prevPhotos, ...data]);
    }
  }, [data, page]);

  const handleScroll = () => {
    const isScrolledToBottom =
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight;
    const isScrolledToTop = document.documentElement.scrollTop === 0;

    if (isScrolledToBottom && !isLoading && !isError) {
      setPage((prevPage) => prevPage + 1); // Scroll down
    }

    if (isScrolledToTop && !isLoading && !isError && page > 1) {
      setPage((prevPage) => prevPage - 1); // Scroll up
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, isError, page]);

  useEffect(() => {
    // Get existing search terms array from local storage or initialize an empty array
    //const existingSearchTerms = JSON.parse(localStorage.getItem("searchTerms")) || [];
    // Get existing search terms array from local storage or initialize an empty array
    const existingSearchTermsString = localStorage.getItem("searchTerms")!;
    const existingSearchTerms = existingSearchTermsString
      ? JSON.parse(existingSearchTermsString)
      : [];

    // Append the new debounced search term to the existing array
    const updatedSearchTerms = [...existingSearchTerms, debouncedSearchTerm];

    // Save the updated array back to local storage
    localStorage.setItem("searchTerms", JSON.stringify(updatedSearchTerms));
  }, [debouncedSearchTerm]);

  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="px-6">
      <div className="flex justify-between py-3">
        <Link to="/ისტორია">ისტორია</Link>
        <input
          className="w-[20%] border border-gray-500 rounded"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => (
            setSearchTerm(e.target.value), setPage(1), setAllPhotos([])
          )}
        />
      </div>

      <div className="grid grid-cols-4 gap-1">
        {allPhotos.map((photo: Photo) => (
          <img
            key={photo.id}
            src={photo.urls.regular}
            alt={photo.alt_description}
            className="h-[350px]"
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
            src={selectedPhoto?.urls.full}
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
export default MainPage;
