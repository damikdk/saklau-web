import { useEffect, useState } from "react";
import "./App.css";
import PhotoList from "./components/PhotoList";
import useInterval from "./utils/utils";

const ENDPOINT = "http://localhost:8000/";

export type ImageFile = {
  path: string;
  thumbnail: string;
  type: string;
  width: number;
  height: number;
  status: string;
  id: string;
  taken_date: string;
};

const getAll = async () => {
  const response = await fetch(ENDPOINT);
  const jsonResponse = await response.json();

  const arrayOfLists = jsonResponse.map((fileMeta: ImageFile) => {
    const fileUrl = `${ENDPOINT}file/${fileMeta.path}`;
    const thumbnailExtension = fileMeta.type == "video" ? "webp" : "jpg";
    const thumbnailUrl = `${ENDPOINT}file/cache/${fileMeta.id}.${thumbnailExtension}`;

    return {
      path: fileUrl,
      thumbnail: thumbnailUrl,
      type: fileMeta.type,
      width: fileMeta.width,
      height: fileMeta.height,
      status: fileMeta.status,
      taken_date: fileMeta.taken_date,
    };
  });

  return arrayOfLists.sort(
    // @ts-ignore
    (a, b) => new Date(b.taken_date).getTime() - new Date(a.taken_date).getTime()
  );
};

const fireAction = (action: string) => {
  fetch(ENDPOINT + action);
};

const getStatus = async (): Promise<string> => {
  const response = await fetch(ENDPOINT + "status");
  const jsonResponse = await response.json();

  return jsonResponse;
};

export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  UNKNOW = "unknown",
}

const typeFromUrl = (filename: string) => {
  const filenameUpper = filename.toUpperCase();
  const imageFormats = ["JPG", "PNG", "JPEG, .HEIC"];
  const videoFormats = ["MOV", "MP4", "MKV"];

  if (videoFormats.some((videoType) => filenameUpper.endsWith(videoType))) {
    return MediaType.VIDEO;
  } else if (
    imageFormats.some((imageType) => filenameUpper.endsWith(imageType))
  ) {
    return MediaType.IMAGE;
  } else {
    return MediaType.UNKNOW;
  }
};

function App() {
  const [apiResponse, setApiResponse] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getStatus().then((newStatus) => setStatus(newStatus));
    getAll().then((result) => setApiResponse(result));
  }, []);

  useInterval(() => {
    getStatus().then((newStatus) => setStatus(newStatus));
  }, 1000 * 1);

  return (
    <div className="App">
      <header className="App-header">
        <a className="App-link" href={ENDPOINT}>
          saklau
        </a>

        <button onClick={() => fireAction("scan")} type="button">
          scan
        </button>

        <button onClick={() => fireAction("import")} type="button">
          import
        </button>

        <button onClick={() => fireAction("thumb")} type="button">
          thumbnails
        </button>

        <button type="button">{status}</button>
      </header>

      <PhotoList images={apiResponse} />
    </div>
  );
}

export default App;
