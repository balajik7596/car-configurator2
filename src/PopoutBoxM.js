import React, { useState, useEffect } from "react";
import "./PopoutBoxM.css";

    const hotspotDescriptions = [
        {
          id: "airflaps",
          heading: "Active Air Flaps",
          imgsrc: "./hotspots/mobile/airflaps.png",
          message:
            "The Active Air Flap (AAF) # adds a flare in style and performance, optimizing airflow for cooling and enhanced aerodynamics.",
        },
        {
          id: "bumper",
          heading: "Pixelated graphic rear bumper",
          imgsrc: "./hotspots/mobile/bumper.png",
          message:
            "Complementing the front design, the pixelated graphic rear bumper, and the connected LED tail lamps offer an innovative and electrifying appearance.",
        },
        {
          id: "charger",
          heading: "Vehicle-to-Load (V2L) : Outside",
          imgsrc: "./hotspots/mobile/charger.png",
          message:
            "Hyundai CRETA Electric comes equipped with a charging port with multi-colour surround light and state of charge (SOC) indicator to provide ease of access while charging.",
        },
        {
          id: "wheel",
          heading: "R17 (D=436.6 mm) Aero Alloy wheels",
          imgsrc: "./hotspots/mobile/wheel.png",
          message:
            "Equipped with R17 Aero Alloy Wheels with Low Rolling Resistance (LRR) tyres, the CRETA Electric enhances aerodynamic performance, contributing to improved range efficiency.",
        },
        {
          id: "steering",
          heading: "3-Spoke Unique Designed Steering Wheel",
          imgsrc: "./hotspots/mobile/steering.png",
          message:
            "Step inside Hyundai CRETA Electric and get transported to a world of calm. It comes equipped with an EV specific modern three-spoke steering wheel with morse code “H” for Hyundai. This adds to the vibrant interiors of Hyundai CRETA Electric. ",
        },
        {
          id: "display",
          heading:
            "Dual curvilinear screens - 26.03 cm (10.25”) (Infotainment and Cluster)",
          imgsrc: "./hotspots/mobile/display.png",
          message:
            "Step inside Hyundai CRETA Electric and get transported to a world of calm. The dual curvilinear screens - 26.03 cm (10.25”) (HD infotainment and digital cluster) ensure everything you need is right in front of you.",
        },
        {
          id: "seat",
          heading: "Eco-friendly seat upholstery with CRETA Electric branding",
          imgsrc: "./hotspots/mobile/seat.png",
          message:
            "Hyundai CRETA Electric features eco-friendly seats crafted from sustainable materials including recycled plastic bottles and corn extract.**",
          disclaimer: "**Basis variants seat upholstery are of two types either fabric or bio-leather. Fabric upholstery consist of 20% recycled PET bottle material. Bio-leather consist of 10% bio-material (corn extracts)."

        },
        {
          id: "v2l",
          heading: "Vehicle to Load (V2L) :  Inside",
          imgsrc: "./hotspots/mobile/v2l.png",
          message:
            "Hyundai CRETA Electric’s technology is very intuitive. Utmost care has been taken to ensure your convenience. The vehicle-to-load (V2L) inside technology allows you to power your appliances, anywhere and anytime. ",
        },
        {
          id: "console",
          heading: "Floating console with surround ocean blue ambient light",
          imgsrc: "./hotspots/mobile/console.png",
          message:
            "The unique floating console with surround ocean blue ambient light is a standout design, which offers the passengers the future of driving experience. Designed with both style and functionality in mind, the console also offers smart open storage space, enhancing driver’s experience and utility. ",
        },
    ];

const PopoutBoxM = ({ show, id, onClose }) => {
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [disclaimer, setDisclaimer] = useState("");
  

  useEffect(() => {
    if (id) {
      const selectedHotspot = hotspotDescriptions.find((h) => h.id === id);
      if (selectedHotspot) {
        setHeading(selectedHotspot.heading);
        setDescription(selectedHotspot.message);
        setImgSrc(selectedHotspot.imgsrc);
        setDisclaimer(selectedHotspot.disclaimer?selectedHotspot.disclaimer:"")

      }
    } else {
      setHeading("");
      setDescription("");
      setImgSrc("");
      setDisclaimer("");

    }
  }, [id]);

  return (
    <div className={`popout-container ${show ? "open" : "closed"}`}>
      <button className="popout-toggle" onClick={onClose}>
        {show ? "X" : "i"}
      </button>
      {show && (
        <div className="popout-content">
          <div className="popout-row">
            <div className="popout-image">
              <img src={imgSrc} alt="Popout Visual" />
            </div>
          </div>
          <div className="popout-description">
            <p>{description}</p>
            <p className="popup-disclaimer">{disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopoutBoxM;
