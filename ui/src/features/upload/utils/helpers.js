import UploadService from "../services/upload.service.js";

export const getPhotoUrl = async (file) => {
  if (file instanceof File) {
    return await UploadService.uploadFile(file);
  }
  return file;
};
