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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const reset = () => setFormData(initialForm);

  const submitLead = async ({ selectedProduct } = {}) => {
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
      console.error("Error submitting form:", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSubmitted = () => setIsSubmitted(false);

  return {
    formData,
    setFormData,
    isSubmitting,
    isSubmitted,
    handleChange,
    submitLead,
    clearSubmitted,
    reset,
  };
}
