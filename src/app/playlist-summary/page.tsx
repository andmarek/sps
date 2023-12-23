"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

import { useState } from "react";

export default function PlaylistSummary() {
  async function submitForm(e) {
    setIsLoading(true);
    e.preventDefault();

    try {
      console.log(playlistId)
      console.log("wsss");
      const response = await fetch("/api/playlist-summary", {
        method: "POST",
        body: JSON.stringify({ playlistId: playlistId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("the data");
        console.log(data);
        setSummaryReady(true);
        setSummary(data.message.content);
      } else {
        const errorData = await response.json();
        console.error("Server responded with an error: ", errorData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  // https://open.spotify.com/playlist/3D9xLwPVZa8dZc30v78LKH?si=ad505454c6894a7b
  const [isLoading, setIsLoading] = useState(false);
  const [playlistId, setPlaylistId] = useState("");

  const [summary, setSummary] = useState("");
  const [summaryReady, setSummaryReady] = useState(false);
  return (
    <div className="flex justify-center items-center flex-col">
      <div>
        <form
          className="my-5"
          onSubmit={(e) => {
            submitForm(e);
          }}
        >
          <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight"> Put your playlist here: </h1>
          <Input onChange={(e) => setPlaylistId(e.target.value)} />
          {isLoading ? (
            <Button disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" variant="outline">Button</Button>
          )}
        </form>
      </div>
      <div className="flex justify-center w-1/2">
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {" "}
          {summary != "" && summary}{" "}
        </p>
      </div>
    </div>
  );
}
