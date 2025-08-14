import { useRef, useState } from "react";

export function useRecaptcha() {
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState("");
  const recaptchaRef = useRef(null);

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    if (value) {
      setRecaptchaError("");
    }
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaValue(null);
    setRecaptchaError("reCAPTCHA expired. Please verify again.");
  };

  const validateRecaptcha = () => {
    if (!recaptchaValue) {
      setRecaptchaError("Please complete the reCAPTCHA verification");
      return false;
    }
    return true;
  };

  return {
    recaptchaValue,
    setRecaptchaValue,
    recaptchaError,
    setRecaptchaError,
    recaptchaRef,
    handleRecaptchaChange,
    handleRecaptchaExpired,
    validateRecaptcha,
  };
}
