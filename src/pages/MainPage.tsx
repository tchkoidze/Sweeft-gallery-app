import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const accessKey = "8odbcWMjbrbIQNaomRBZSmIdlFgUFFKO6EECa_M7s9I";
const apiUrl = "https://api.unsplash.com";

interface Photo {
  id: string;
  downloads:number;
  likes:number;
  views:number;
  urls: {
    full:string;
    raw:string;
    regular: string;
    small:string;
    thumb:string;
  };
  alt_description: string;
  width: number;
  height: number;
}

const headers = {
  Authorization: `Client-ID ${accessKey}`,
};

function MainPage() {
  const photos = useQuery({
    queryKey: ["popular_photos"],
    queryFn: () =>
      //axios
        .get(`${apiUrl}/photos?page=1&per_page=20&order_by=popular`, {
          headers: { Authorization: `Client-ID ${accessKey}` },
        })
        .then((res) => res.data),
  });

  if (photos.isPending) return "Loading...";
  if (photos.error) return "An error has occurred: " + photos.error.message;

  return (
    <div>
      <h1>ეს არის მთავარი გვერდი</h1>
      {photos.data.map((photo: Photo) => (
        <img  key={photo.id} src={photo.urls.regular} alt={photo.alt_description} />
      ))}
    </div>
  );
}
export default MainPage;
