import React, { useState } from "react";
import PhotoAlbum from "react-photo-album";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { ImageFile, MediaType } from "../App";

const PhotoList: React.FC<{ images: ImageFile[] }> = ({ images }) => {
  const [previewImageIndex, setPreviewImageIndex] = useState(-1);

  const thumbnails = images.map((image) => {
    return {
      src: image.thumbnail,
      width: image.width > 0 ? image.width : 256,
      height: image.height > 0 ? image.height : 256,
      type: image.type,
    };
  });

  const fullsizeImages = images.map((image) => {
    return {
      // src for images
      src: image.path,
      type: image.type,
      // sources for videos
      sources: [
        {
          src: image.path,
          type: "video/mp4",
        },
      ],
    };
  });

  return (
    <>
      <PhotoAlbum
        layout="rows"
        photos={thumbnails}
        targetRowHeight={100}
        padding={1}
        spacing={0}
        onClick={({ index }) => setPreviewImageIndex(index)}
        breakpoints={[300, 600, 1200]}
      />

      <Lightbox
        // @ts-ignore
        slides={fullsizeImages}
        open={previewImageIndex >= 0}
        index={previewImageIndex}
        close={() => setPreviewImageIndex(-1)}
        plugins={[Video, Fullscreen, Slideshow, Thumbnails, Zoom]}
        video={{
          autoPlay: true,
          loop: true,
          muted: true,
          disablePictureInPicture: true,
        }}
      />
    </>
  );
};

export default PhotoList;
