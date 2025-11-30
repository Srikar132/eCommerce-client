"use client";

import React from 'react';
import ImageZoom from 'react-image-zooom';
// import Zoom from 'react-medium-image-zoom';
// import 'react-medium-image-zoom/dist/styles.css';

interface ImageZoomModalProps {
  image: {
    id: string;
    url: string;
    alt: string;
  };
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ 
  image 
}) => {
  return (
    <ImageZoom
      src={image.url as string}
      alt={image.alt as string}

    />
  );
};

export default ImageZoomModal;
