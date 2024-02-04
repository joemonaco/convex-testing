"use client";

import { useMutation, useQueries, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress";

export default function ThumbnailPage() {
  const params = useParams<{ thumbnailId: Id<"thumbnails"> }>();

  const thumbnailId = params.thumbnailId;
  const thumbnail = useQuery(api.thumbnails.getThumbnail, {
    thumbnailId,
  });

  const voteOnThumbnail = useMutation(api.thumbnails.voteOnThumbnail);

  const session = useSession();
  if (!thumbnail || !session.session) {
    return <div>Loading...</div>;
  }
  const images = [thumbnail.aImage, thumbnail.bImage];

  const hasVoted = thumbnail.voteIds.includes(session.session.user.id);

  function getVotesFor(imageId: string) {
    if (!thumbnail) return 0;
    return thumbnail.aImage === imageId ? thumbnail.aVotes : thumbnail.bVotes;
  }

  function votePercent(imageId: string) {
    if (!thumbnail) return 0;
    const totalVotes = thumbnail.aVotes + thumbnail.bVotes;
    if (totalVotes != 0) {
      return Math.round((getVotesFor(imageId) / totalVotes) * 100);
    } else return 0;
  }

  return (
    <div className="mt-16">
      <div className="grid grid-cols-2 gap-8">
        <div className="flex items-center flex-col gap-4">
          <h2 className="text-4xl font-bold text-center">Test Image A</h2>

          <Image
            width="600"
            height="600"
            alt="image test A"
            className="w-full"
            src={getImageUrl(images[0])}
          />

          {hasVoted ? (
            <>
              <Progress value={votePercent(images[0])} className="w-full" />
              <div className="text-lg">{getVotesFor(images[0])} Votes</div>
            </>
          ) : (
            <Button
              size="lg"
              className="w-fit"
              onClick={() => {
                voteOnThumbnail({
                  thumbnailId,
                  imageId: images[0],
                });
              }}
            >
              Vote A
            </Button>
          )}
        </div>

        <div className="flex items-center flex-col gap-4">
          <h2 className="text-4xl font-bold text-center">Test Image B</h2>

          <Image
            width="600"
            height="600"
            alt="image test B"
            className="w-full"
            src={getImageUrl(images[1])}
          />

          {hasVoted ? (
            <>
              <Progress value={votePercent(images[1])} className="w-full" />
              <div className="text-lg">{getVotesFor(images[1])} Votes</div>
            </>
          ) : (
            <Button
              size="lg"
              className="w-fit"
              onClick={() => {
                voteOnThumbnail({
                  thumbnailId,
                  imageId: images[1],
                });
              }}
            >
              Vote B
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
