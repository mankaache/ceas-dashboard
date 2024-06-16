import Image from "next/image";
import { Inter } from "next/font/google";
import { BaseLayout } from "@/components/layout";
import { CONSTANTS } from "@/data";
import React from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestore } from "@/firebase/config";
import { useCollection } from "react-firebase-hooks/firestore";
import { InnerPageLoader } from "@/components/loaders";
import { InnerPageError } from "@/components/errors";
import { ICategoryType } from "@/models";
import dynamic from "next/dynamic";
import Link from "next/link";
import { UserVisitsChart } from "@/components/pages/dashboard";

const inter = Inter({ subsets: ["latin"] });

// const UserVisitsChart = dynamic(() =>
//   import("@/components/pages/dashboard").then((mod) => mod.UserVisitsChart)
// );

export default function Home() {
  const media = React.useMemo(() => CONSTANTS.DATA_MAP, []);
  // const media: { [key in ICategoryType]: string } = CONSTANTS.DATA_MAP;
  // const counts: { [key in ICategoryType]: number } = {} as {
  //   [key in ICategoryType]: number;
  // };

  const initialCounts: { [key in ICategoryType]: number } = {} as {
    [key in ICategoryType]: number;
  };
  const [counts, setCounts] = React.useState(initialCounts);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Object.keys(media).forEach((key) => (counts[key as ICategoryType] = 0));

  // Object.keys(media).forEach((key) => {
  //   const q = query(
  //     collection(firestore, media[key as ICategoryType])
  //     // orderBy("modifiedAt", "desc")
  //   );
  //   const [value, loading, error] = useCollection(q, {
  //     snapshotListenOptions: { includeMetadataChanges: false },
  //   });

  //   error && setError(error);
  //   loading && setLoading(loading);

  //   value ? (counts[key as ICategoryType] = value.docs.length) : 0;
  // });

  React.useEffect(() => {
    // Create an array of promises to fetch data for each category
    const fetchPromises = Object.keys(media).map((key) => {
      console.log(key);
      const q = query(
        collection(firestore, media[key as ICategoryType])
        // orderBy("modifiedAt", "desc")
      );

      return getDocs(q);
    });

    // Execute all queries concurrently
    Promise.all(fetchPromises)
      .then((querySnapshots) => {
        // Update counts based on query results
        const updatedCounts: { [key in ICategoryType]: number } = {} as {
          [key in ICategoryType]: number;
        };

        querySnapshots.forEach((snapshot, index) => {
          const key = Object.keys(media)[index] as ICategoryType;
          console.log(key);
          updatedCounts[key] = snapshot.docs.length;
        });

        setCounts(updatedCounts);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [media]);

  const STATS = [
    {
      name: media["articles"],
      value: counts["articles"],
      href: "/articles",
    },
    {
      name: media["documents"],
      value: counts["documents"],
      href: "/documents",
    },
    {
      name: media["photos"],
      value: counts["photos"],
      href: "/photos",
    },
    {
      name: media["videos"],
      value: counts["videos"],
      href: "/videos",
    },
    {
      name: media["training-programs"],
      value: counts["training-programs"],
      href: "/training-programs",
    },
    {
      name: media["events"],
      value: counts["events"],
      href: "/events",
    },
  ];

  const ANALYTICS = [];

  if (loading) {
    return <InnerPageLoader loading={loading} />;
  }

  if (error) {
    return <InnerPageError error={error} />;
  }

  return (
    <BaseLayout>
      <div className="flex flex-col w-full p-4 h-full">
        <h2 className="welcome text-3xl mb-6 text-blue-600 font-bold">
          Bienvenue
        </h2>
        <div className="user-visits-chart">
          <UserVisitsChart />
        </div>
        <div className="statistics">
          <p className="stats text-slate-500 my-2">Statistiques</p>
          <div className="grid grid-cols-3 gap-4">
            {STATS.map((stat, idx) => (
              <Link key={idx} href={stat.href} legacyBehavior>
                <div className="articles bg-gradient-to-br from-blue-800 to-blue-400 cursor-pointer w-full h-[120px] border rounded-lg shadow-lg bg-white flex flex-col items-center justify-center gap-2">
                  <p className="text-slate-300 text-md text-left capitalize">
                    {stat.name}
                  </p>
                  <p className="text-4xl text-primary text-white">
                    {stat.value}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
