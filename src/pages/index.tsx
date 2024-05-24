import Image from "next/image";
import { Inter } from "next/font/google";
import { BaseLayout } from "@/components/layout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const STATS = [
    {
      name: "Articles",
      value: 2,
    },
    {
      name: "Documents",
      value: 4,
    },
    {
      name: "Photos",
      value: 20,
    },
    {
      name: "Programmes",
      value: 6,
    },
    {
      name: "événements",
      value: 1,
    },
  ];

  const ANALYTICS = [];
  return (
    <BaseLayout>
      <div className="flex flex-col w-full p-4 h-full">
        <div className="statistics">
          <p className="stats text-slate-500 my-2">Statistiques</p>
          <div className="flex basis-1 gap-4">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className="articles basis-1/5 h-[100px] border rounded-lg shadow-sm bg-white flex flex-col items-center justify-center gap-2"
              >
                <p className="text-slate-500 text-xl capitalize">{stat.name}</p>
                <p className="text-4xl text-primary">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
