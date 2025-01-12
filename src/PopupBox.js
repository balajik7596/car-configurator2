import React, { useState, useEffect } from "react";
import "./PopupBox.css";

const hotspotDescriptions = [
    {
      id: "airflaps",
      heading: "Active Air Flaps",
      imgsrc: "./hotspots/airflaps.jpg",
      message:
        "The Active Air Flap (AAF) # adds a flare in style and performance, optimizing airflow for cooling and enhanced aerodynamics.",
    },
    {
      id: "bumper",
      heading: "Pixelated graphic rear bumper",
      imgsrc: "./hotspots/bumper.jpg",
      message:
        "Complementing the front design, the pixelated graphic rear bumper, and the connected LED tail lamps offer an innovative and electrifying appearance.",
    },
    {
      id: "charger",
      heading: "Vehicle-to-Load (V2L) : Outside",
      imgsrc: "./hotspots/charger.jpg",
      message:
        "Whether you're camping or in need of an emergency power source, the Hyundai CRETA Electric enables you to power your gadgets and appliances both inside and outside the vehicle, ensuring you never run out of power. Hyundai CRETA Electric comes equipped with a charging port with multi-colour surround light and state of charge (SOC) indicator to provide ease of access while charging. ",
    },
    {
      id: "wheel",
      heading: "R17 (D=436.6 mm) Aero Alloy wheels",
      imgsrc: "./hotspots/wheel.jpg",
      message:
        "Equipped with R17 Aero Alloy Wheels with Low Rolling Resistance (LRR) tyres, the CRETA Electric enhances aerodynamic performance, contributing to improved range efficiency.",
    },
    {
      id: "steering",
      heading: "3-Spoke Unique Designed Steering Wheel",
      imgsrc: "./hotspots/steering.jpg",
      message:
        "Step inside Hyundai CRETA Electric and get transported to a world of calm. It comes equipped with an EV specific modern three-spoke steering wheel with morse code “H” for Hyundai. This adds to the vibrant interiors of Hyundai CRETA Electric. ",
    },
    {
      id: "display",
      heading:
        "Dual curvilinear screens - 26.03 cm (10.25”) (Infotainment and Cluster)",
      imgsrc: "./hotspots/display.jpg",
      message:
        "Step inside Hyundai CRETA Electric and get transported to a world of calm. The dual curvilinear screens - 26.03 cm (10.25”) (HD infotainment and digital cluster) ensure everything you need is right in front of you.",
    },
    {
      id: "seat",
      heading: "Eco-friendly seat upholstery with CRETA Electric branding",
      imgsrc: "./hotspots/seat.jpg",
      message:
        "Hyundai CRETA Electric features eco-friendly seats crafted from sustainable materials including recycled plastic bottles and corn extract, and adorned with unique Hyundai CRETA Electric branding, showcasing a perfect blend of comfort, style and sustainability. ",
    },
    {
      id: "v2l",
      heading: "Vehicle to Load (V2L) :  Inside",
      imgsrc: "./hotspots/v2l.jpg",
      message:
        "Hyundai CRETA Electric’s technology is very intuitive. Utmost care has been taken to ensure your convenience. The vehicle-to-load (V2L) inside technology allows you to power your appliances, anywhere and anytime. ",
    },
    {
      id: "console",
      heading: "Floating console with surround ocean blue ambient light",
      imgsrc: "./hotspots/console.jpg",
      message:
        "The unique floating console with surround ocean blue ambient light is a standout design, which offers the passengers the future of driving experience. Designed with both style and functionality in mind, the console also offers smart open storage space, enhancing driver’s experience and utility. ",
    },
];

const iconDescriptions = [
{message:'Turn on the light',
 imgsrc:'/Light indicator.png',
},
{message:'Open driver door',
    imgsrc:'/doorrf.png',
},
{message:'Open passenger door',
    imgsrc:'/doorlf.png',
},
{message:'Open rear driver side door',
    imgsrc:'/doorbr.png',
},
{message:'Open rear passenger side door',
    imgsrc:'/doorbl.png',
},
{message:'Open all doors',
    imgsrc:'/door.png',
},
{message:'Open boot',
    imgsrc:'/back.png',
},
{message:'Open sunroof',
    imgsrc:'/sun.png',
},
{message:'Take me to interior',
    imgsrc:'/in.png',
},
{message:'Take me to exterior',
    imgsrc:'/out.png',
},
];

const PopupBox = ({ show, id, onClose }) => {
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    if (id !== "") {
      const selectedHotspot = hotspotDescriptions.find((h) => h.id === id);
      if (selectedHotspot) {
        setHeading(selectedHotspot.heading);
        setDescription(selectedHotspot.message);
        setImgSrc(selectedHotspot.imgsrc);
      }
    } else {
      setHeading("");
      setDescription("");
      setImgSrc("");
    }
  }, [id]);

  return (
    <div className={`popup-container ${show ? "open" : "closed"}`}>
      <button className={`popup-toggle ${show ? "open" : "closed"}`} onClick={onClose}>
        {show ? "X" : "i"}
      </button>
      {show && (
        <div className="popup-content">
          {id ? (
            // Display detailed content if id is provided
            <>
              <div className="popup-header">
                <h3>{heading}</h3>
              </div>
              <div className="popup-image">
                <img src={imgSrc} alt="Popup Visual" />
              </div>
              <div className="popup-message">
                <p>{description}</p>
              </div>
            </>
          ) : (
            // Display help tab when id is empty
            <div className="help-tab">
              <ul className="help-list">
                {iconDescriptions.map((item) => (
                  <li key={item.message} className="help-item">
                    <img
                      src={item.imgsrc}
                      alt={item.message}
                      className="help-item-image"
                    />
                    <div className="help-item-text">
                      <p>{item.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PopupBox;
