
import React, { useState, useEffect } from "react";

const ImageCarousel = ({ images, interval }) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage((currentImage + 1) % images.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [currentImage]);

  const handleNextImage = () => {
    setCurrentImage((currentImage + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImage((currentImage - 1 + images.length) % images.length);
  };

  return (
    <div style={{ position: "relative", width: "65%" }}>
      {images.map((image, index) => (
         <img
         key={index}
         src={image}
         alt={`Image ${index}`}
         style={{
           position: "absolute",
           top: 10,
           left: 300,
           opacity: currentImage === index ? 1 : 0,
           transition: "opacity 0.5s ease-in-out",
           width: "100%",
         }}
        />
      ))}
      {/* <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: "1rem" }}>
        <button onClick={handlePrevImage} disabled={currentImage === 0}>Prev</button>
        <button onClick={handleNextImage} disabled={currentImage === images.length - 1}>Next</button>
      </div> */}
    </div>
  );
};

export default ImageCarousel;