import { useState } from "react";

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
      // --- הוספנו את השגיאה הזו ---
      tempErrors.phone = "מספר טלפון לא תקין"; 
      isValid = false;
    }

    // 3. בדיקת אימייל (חובה + תקינות)
    // בדיקה שמוודאת שיש @ ונקודה אחריו
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      tempErrors.email = "נא להזין אימייל";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      // --- הוספנו את השגיאה הזו ---
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
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          productInterest: selectedProduct?.name || formData.productInterest,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        reset();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
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