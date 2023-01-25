// initialize the unsplash
import { createApi } from "unsplash-js";

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESSKEY,
  //...other fetch options
});

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shops",
    perPage: 10,
  });

  const unsplashResults = photos.response.results;
  return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async () => {
  const photos = await getListOfCoffeeStorePhotos();

  const searchParams = new URLSearchParams({
    query: "coffee stores",
    ll: "41.8781,-87.6298",
    open_now: "true",
    sort: "DISTANCE",
    limit: 6,
  });

  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?${searchParams}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: process.env.FOURSQUARE_API_AUTH,
      },
    }
  );

  const data = await response.json();

  // console.log(data);
  return data.results.map((value, idx) => {
    return {
      ...value,
      imgUrl: photos[idx],
    };
  });
};
