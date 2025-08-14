import UploadService from "../../upload/services/upload.service.js";

export const getBadgeColor = (difficulty) => {
  const colorsMap = {
    easy: "green",
    medium: "yellow",
    hard: "red",
  };

  return colorsMap[difficulty] || "gray";
};
