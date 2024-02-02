"use client";
import { SignInButton, SignOutButton, auth, useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const { isSignedIn } = useSession();

  const createThumbnail = useMutation(api.thumbnails.createThumbnail);
  const thumbnails = useQuery(api.thumbnails.getThumbnailsForUser);
  return (
    <main className="">
      {isSignedIn && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(e.currentTarget);
            const title = formData.get("title") as string;
            createThumbnail({
              title,
            });
            form.reset();
          }}
        >
          <label>Title</label>
          <input name="title" className="text-black" />
          <button>Create</button>
        </form>
      )}

      {thumbnails?.map((thumbnail) => {
        return <div key={thumbnail._id}>{thumbnail.title}</div>;
      })}
    </main>
  );
}
