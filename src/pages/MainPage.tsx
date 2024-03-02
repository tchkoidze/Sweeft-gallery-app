import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

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

const headers = {
  Authorization: `Client-ID ${accessKey}`,
};

function MainPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  //
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);

  console.log("1", debouncedSearchTerm);

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
            //setAllPhotos((previouse))
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

  //
  useEffect(() => {
    if (data && page === 1) {
      setAllPhotos(data);
    } else if (data && page > 1) {
      setAllPhotos((prevPhotos) => [...prevPhotos, ...data]);
    }
  }, [data, page]);

  /*const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight &&
      !isLoading &&
      !isError
      //&&data.length >= 20
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };*/
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

  //[isLoading, isError, data]

  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>ეს არის მთავარი გვერდი</h1>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => (
            setSearchTerm(e.target.value), setPage(1), setAllPhotos([])
          )}
        />
      </div>

      {/*data.map((photo: Photo) => (
        <img
          key={photo.id}
          src={photo.urls.regular}
          alt={photo.alt_description}
        />
      ))*/}
      <div className="grid grid-cols-4 gap-1">
        {allPhotos.map((photo: Photo) => (
          <img
            key={photo.id}
            src={photo.urls.regular}
            alt={photo.alt_description}
          />
        ))}
      </div>
      {allPhotos.map((photo: Photo) => (
        <img
          key={photo.id}
          src={photo.urls.regular}
          alt={photo.alt_description}
        />
      ))}
    </div>
  );
}
export default MainPage;

/*
queryFn: async () => {
      if (searchTerm.trim() === "") {
        return await axios
          .get(`${apiUrl}/photos?page=1&per_page=20&order_by=popular`, {
            headers: { Authorization: `Client-ID ${accessKey}` },
          })
          .then((res) => res.data);
      } else {
        return await axios
          .get(
            `https://api.unsplash.com/search/photos/?client_id=${accessKey}&per_page=20&query=${debouncedSearchTerm}`
          )
          .then((res) => {
          console.log(res.data.results);
          return res.data.results;
        });
      }
    },
*/

/*
const { data, error, isPending } = useQuery({
    queryKey: ["photos"],
    queryFn: async () =>
      await axios
        .get(`${apiUrl}/photos?page=1&per_page=20&order_by=popular`, {
          headers: { Authorization: `Client-ID ${accessKey}` },
        })
        .then((res) => {
          console.log(res);
          return res.data;
        }),
  });

*/

/* *****
function MainPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  //const [isFetching, setIsFetching] = useState(false);

  console.log("1", debouncedSearchTerm);

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
              return res.data.results;
            });
        }
      }
    },
    //keepPreviousData: true,
    refetchOnWindowFocus: false,
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
  }, [isLoading, isError, data]);

  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>ეს არის მთავარი გვერდი</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {data.map((photo: Photo) => (
        <img
          key={photo.id}
          src={photo.urls.regular}
          alt={photo.alt_description}
        />
      ))}
    </div>
  );
}
*/
