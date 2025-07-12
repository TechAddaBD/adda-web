import { divIcon } from "leaflet";

export const getPhotoLabelIcon = (name, photoURL) =>
  divIcon({
    html: `
      <div style="
        display: flex;
        align-items: center;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 4px 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      ">
        <img src="${photoURL}" style="width:24px;height:24px;border-radius:50%;margin-right:6px;" />
        <span style="font-size:13px;font-weight:500;color:#333;">${name}</span>
      </div>
    `,
    className: "",
    iconSize: [120, 32],
    iconAnchor: [60, 16],
  });
