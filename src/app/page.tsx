"use client";
import { SignInButton, SignOutButton, auth, useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../convex/_generated/api";
import { getImageUrl } from "@/lib/utils";

export default function Home() {
  const { isSignedIn } = useSession();

  const thumbnails = useQuery(api.thumbnails.getThumbnailsForUser);
  return (
    <main className="flex">
      <div className="grid grid-cols-3 gap-4 ">
        {thumbnails?.map((thumbnail) => {
          return (
            <>
              <div
                key={thumbnail._id}
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover: duration-300 cursor- pointer"
              >
                <h2 className="m-4 text-center">{thumbnail.title}</h2>
                <Image
                  width="600"
                  height="600"
                  alt="image test A"
                  className="w-full"
                  src={getImageUrl(thumbnail.aImage)}
                />
              </div>
            </>
          );
        })}
      </div>
    </main>
  );
}
