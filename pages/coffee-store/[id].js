import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import useSWR from "swr";

import cls from "classnames";

import styles from "../../styles/coffee-store.module.css";
import { fetchCoffeeStores } from "@/lib/coffee-stores";

import { StoreContext } from "../../store/store-context";

import { fetcher, isEmpty } from "../../utils";

export async function getStaticProps(staticProps) {
  const params = staticProps.params;

  const coffeeStores = await fetchCoffeeStores();
  const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
    return coffeeStore.fsq_id.toString() === params.id; //dynamic id
  });

  return {
    props: {
      coffeeStore: coffeeStoreFromContext ? coffeeStoreFromContext : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.fsq_id.toString(),
      },
    };
  });

  return {
    paths,

    fallback: true, // have to show loading so that in the mean time it cached the new data
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const id = router.query.id;

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  // node api called
  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { fsq_id, name, voting, imgUrl, neighbourhood, location } =
        coffeeStore;
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `${fsq_id}`,
          name,
          voting,
          imgUrl,
          neighbourhood: neighbourhood || "",
          address: location.address || "",
        }),
      });

      const dbCoffeeStore = await response.json();
    } catch (err) {
      console.log("error creating coffee store", err);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.fsq_id.toString() === id; //dynamic id
        });

        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      //SSG
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore]);

  const { name, location, neighborhood, imgUrl, address } = coffeeStore;

  const [votingCount, setVotingCount] = useState(0);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data) {
      setCoffeeStore(data);
      setVotingCount(data.voting);
    }
  }, [data]);

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch(`/api/favouriteCoffeeStoreById?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();

      if (dbCoffeeStore) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.log("error upvoting coffee store", err);
    }
  };

  if (error) {
    return <div>Something went wrong retriving coffee store</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee store`} />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">← Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              width="24"
              height="24"
              alt="places icon"
            />
            <p className={styles.text}>{location?.address || address}</p>
          </div>
          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="near me icon"
              />
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="star icon"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
