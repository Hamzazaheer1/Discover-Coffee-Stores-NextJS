// initialize the unsplash
import { createApi } from "unsplash-js";

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESSKEY,
  //...other fetch options
});

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shops",
    perPage: 10,
  });

  const unsplashResults = photos.response?.results || [];
  return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async (
  // latLong = "41.8781,-87.6298",
  latLong = "43.653833032607096%2C-79.37896808855945",
  limit = 6
) => {
  const photos = await getListOfCoffeeStorePhotos();

  const searchParams = new URLSearchParams({
    query: "coffee stores",
    latLong,
    limit,
  });

  console.log({ latLong, limit });

  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?${searchParams}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_AUTH,
      },
    }
  );

  const data = await response.json();

  console.log({ data });
  return data.results.map((value, idx) => {
    const neighborhood = value.location.neighborhood;
    return {
      ...value,
      imgUrl: photos.length > 0 ? photos[idx] : null,
    };
  });
};
