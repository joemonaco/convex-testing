"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { UploadButton, UploadFileResponse } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { clsx } from "clsx";
import { divide, isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/utils";

const defaultErrorState = {
  title: "",
  imageA: "",
  imageB: "",
};

export default function CreatePage() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createThumbnail = useMutation(api.thumbnails.createThumbnail);

  const [imageA, setImageA] = useState("");
  const [imageB, setImageB] = useState("");

  const [errors, setErrors] = useState(defaultErrorState);

  const { toast } = useToast();
  const router = useRouter();

  return (
    <div className="mt-16">
      <h1 className="text-4xl font-bold mb-8">Create a Thumbnail Test</h1>
      <p className="text-lg max-w-md mb-8">
        Create your test so that other people can vote on their favorite
        thumbnail and help you redsign or pick the best options.
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(e.currentTarget);
          const title = formData.get("title") as string;
          let newErrors = { ...defaultErrorState };
          setErrors(() => newErrors);

          if (!title) {
            newErrors = {
              ...newErrors,
              title: "Please fill in this required field",
            };
          }
          if (!imageA) {
            newErrors = {
              ...newErrors,
              imageA: "Please fill in this required field",
            };
          }
          if (!imageB) {
            newErrors = {
              ...newErrors,
              imageB: "Please fill in this required field",
            };
          }
          setErrors(newErrors);
          const hasErrors = Object.values(newErrors).some(Boolean);
          if (hasErrors) {
            toast({
              title: "Form Errors",
              description: "Please fill in all fields on the page",
              variant: "destructive",
            });
            return;
          }
          const thumbnailId = await createThumbnail({
            aImage: imageA,
            bImage: imageB,
            title,
          });

          router.push(`/thumbnails/${thumbnailId}`);
        }}
      >
        <div className="flex flex-col gap-4 mb-8">
          <Label htmlFor="title">Title</Label>
          <Input
            required
            id="title"
            type="text"
            name="title"
            className={clsx("flex flex-col gap-4", {
              border: errors.title,
              "border-red-500": errors.title,
            })}
          />
          {errors.title && <div className="text-red-500">{errors.title}</div>}
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div
            className={clsx("flex flex-col gap-4", {
              border: errors.imageA,
              "border-red-500": errors.imageA,
            })}
          >
            <h2 className="text-2xl font-bold">Test Image A</h2>

            {imageA && (
              <Image
                width="200"
                height="200"
                alt="image test A"
                src={getImageUrl(imageA)}
              />
            )}

            <UploadButton
              uploadUrl={generateUploadUrl}
              fileTypes={["image/*"]}
              onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                setImageA((uploaded[0].response as any).storageId);
              }}
              onUploadError={(error: unknown) => {
                alert(`ERROR! ${error}`);
              }}
            />

            {errors.imageA && (
              <div className="text-red-500">{errors.imageA}</div>
            )}
          </div>
          <div
            className={clsx("flex flex-col gap-4", {
              border: errors.imageB,
              "border-red-500": errors.imageB,
            })}
          >
            <h2 className="text-2xl font-bold">Test Image B</h2>

            {imageB && (
              <Image
                width="200"
                height="200"
                alt="image test B"
                src={getImageUrl(imageB)}
              />
            )}
            <UploadButton
              uploadUrl={generateUploadUrl}
              fileTypes={["image/*"]}
              onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                setImageB((uploaded[0].response as any).storageId);
              }}
              onUploadError={(error: unknown) => {
                alert(`ERROR! ${error}`);
              }}
            />
            {errors.imageB && (
              <div className="text-red-500">{errors.imageB}</div>
            )}
          </div>
        </div>

        <Button>Create Thumbnail</Button>
      </form>
    </div>
  );
}
