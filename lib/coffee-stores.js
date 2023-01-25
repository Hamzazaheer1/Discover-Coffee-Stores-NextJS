export const fetchCoffeeStores = async () => {
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
        Authorization: "fsq3dxxlYyP2dbhOesjhxpo6nWHfxG4hei+TNeQh2V/WhiM=",
      },
    }
  );

  const data = await response.json();

  console.log(data);
  return data.results;
};
