import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
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

  console.log("1", debouncedSearchTerm);

  const { data, error, isPending } = useQuery({
    queryKey: ["photos", debouncedSearchTerm],
    queryFn: async () => {
      if (searchTerm.trim() === "") {
        return await axios
          .get(`${apiUrl}/photos?page=1&per_page=20&order_by=popular`, {
            headers: { Authorization: `Client-ID ${accessKey}` },
          })
          .then((res) => {
            console.log("2", debouncedSearchTerm);
            return res.data;
          });
      } else {
        if (debouncedSearchTerm) {
          return await axios

            .get(
              `https://api.unsplash.com/search/photos/?client_id=${accessKey}&per_page=20&query=${debouncedSearchTerm}`
            )
            .then((res) => {
              console.log("3", debouncedSearchTerm);
              console.log(res.data.results);
              return res.data.results;
            });
        }
      }
    },
  });

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
