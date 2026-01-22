import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  message: "",
  source: "website",
  productInterest: "",
};

export function useLeadForm() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    // 1. בדיקת שם (חובה)
    if (!formData.name.trim()) {
      tempErrors.name = "נא להזין שם מלא";
      isValid = false;
    }

    // 2. בדיקת טלפון (חובה + תקינות)
    // בדיקה בסיסית: מאפשר מספרים, מקף ופלוס, באורך 9 עד 15 תווים
    const phoneRegex = /^[0-9\-+]{9,15}$/;
    if (!formData.phone.trim()) {
      tempErrors.phone = "נא להזין טלפון";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      tempErrors.phone = "מספר טלפון לא תקין";
      isValid = false;
    }

    // 3. בדיקת אימייל (חובה + תקינות)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      tempErrors.email = "נא להזין אימייל";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "כתובת אימייל לא תקינה";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    // ניקוי שגיאה בעת הקלדה
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const reset = () => {
    setFormData(initialForm);
    setErrors({});
  };

  const submitLead = async ({ selectedProduct } = {}) => {
    if (!validate()) return false;

    setIsSubmitting(true);

    try {
      // ✅ payload שנשלח לשרת
      const payload = {
        ...formData,
        productInterest: selectedProduct?.name || formData.productInterest,
      };

      // ✅ הדפסה של משתני סביבה
      console.log("🌍 ENV:");
      console.log("API_URL =", API_URL);
      console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);
      console.log("MODE =", import.meta.env.MODE);

      // ✅ הדפסה של הבקשה לפני שליחה
      console.log("📤 Sending request to server:");
      console.log("URL:", `${API_URL}/api/leads`);
      console.log("Payload:", payload);

      const response = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // ✅ סטטוס התשובה
      console.log("📥 Server response status:", response.status);

      // ✅ ניסיון לקרוא גוף תשובה (גם אם לא JSON)
      const contentType = response.headers.get("content-type") || "";
      let data = null;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { raw: text };
      }

      // ✅ גוף התשובה
      console.log("📥 Server response body:", data);

      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Server returned an error");
      }

      setIsSubmitted(true);
      reset();
      return true;
    } catch (err) {
      console.error("❌ Error sending lead:", err?.message || err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSubmitted = () => setIsSubmitted(false);

  return {
    formData,
    errors,
    setFormData,
    isSubmitting,
    isSubmitted,
    handleChange,
    submitLead,
    clearSubmitted,
    reset,
  };
}
