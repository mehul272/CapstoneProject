import AppNavbar from "./Navbar";
import React from "react";
import ImageCarousel from "./ImageCarousel";

function HomePage() {
  const images = [
    "https://h3xagn.com/wp-content/uploads/2022/04/part3-1.png",
    "https://www.xoriant.com/cdn/ff/04leSwSrl9_aP3tMbXTWbLGvpemOAlv_NGUN5L0hBwM/1654778613/public/Bodhi-Images/ETL-Data-Pipeline-Benefits-for-Enterprises-Xoriant.svg",
    "https://mixpanel.com/wp-content/uploads/2022/02/MXP-Blog-CensusReverseETL-1920x1080-1.png",
    "https://www.singular.net/wp-content/uploads/2020/02/how_singular_works_hor_03@2x-1024x548-1.png",
  ];

  return (
    <div>
      <AppNavbar />
      <div>
        <ImageCarousel images={images} interval={5000} />
      </div>
    </div>
  );
}

export default HomePage;
