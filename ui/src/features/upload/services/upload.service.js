import axios from "axios";

const URL = import.meta.env.VITE_CLOUDINARY_URL;

const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "intercode");

    const response = await axios.post(URL, formData);
    return response.data.secure_url;
  } catch (error) {
    console.error(
      `Error uploading file`,
      error.response?.data || error.message,
    );
    throw error;
  }
};

const UploadService = {
  uploadFile,
};

export default UploadService;
