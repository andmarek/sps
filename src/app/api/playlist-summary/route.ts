import OpenAI from "openai";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

const prompt =
  "If I am going to give you a list of songs from a playlist and I need you to make claims about my personality in a playfully mean-spirited way.  Please be very frank, and funny; I like tongue-in-cheek and clever humor.  Don't worry about insulting me a little bit, I can take it.  Please DO NOT MAKE A LIST OF INDIVIDUAL SONGS AND WHAT THEY SAY ABOUT ME. I just want a SUCCINCT paragraph, a take about me and who I am based on them.  Also please be INSULTING.  Not vulgar, just playfully insulting.  I will post the songs and their artists as a JSON like this: {title: 'Song title', artists: ['artist1', 'artist2']}.  PLEASE BE MEAN.";

const fetchPlaylist = async (playlistId: string) => {
  try {
    console.log("hye")
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.SPOTIFY_CLIENT_ID +
                ":" +
                process.env.SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;
    const playlistResponse = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    console.log(playlistResponse)
    return playlistResponse.data;
  } catch (error) {
    throw error;
  }
};
export async function POST(request: Request) {
  const formData = await request.json();
  const playlistUrl = formData.playlistId;
  const playlistId = playlistUrl.split("playlist/")[1].split("?si=")[0]

  console.log(playlistId);

  const fetchPlaylistResponse = await fetchPlaylist(playlistId);

  const tracks = fetchPlaylistResponse.items.map((item: any) => {
    return {
      title: item.track.name,
      artists: item.track.artists.map((artist: any) => artist.name),
    };
  });
  console.log(tracks);

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: prompt },
      { role: "user", content: JSON.stringify(tracks)}
    ],
    model: "gpt-3.5-turbo",
  });

  const completionMessage = chatCompletion.choices[0].message;

  return Response.json({message: completionMessage});
}
