import React from "react";
// import "./FogBackground.css";

const FogBackground = () => {
  return (
    <>
      <div className="forest"></div>
      <div className=" foggy"></div>
      <div id="foglayer_01" className="fog">
        <div className="image01"></div>
        <div className="image02"></div>
      </div>
      <div id="foglayer_02" className="fog">
        <div className="image01"></div>
        <div className="image02"></div>
      </div>
      <div id="foglayer_03" className="fog">
        <div className="image01"></div>
        <div className="image02"></div>
      </div>
    </>
  );
};

export default FogBackground;
