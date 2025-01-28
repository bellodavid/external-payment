import React, { createContext, useState, useContext } from "react";

const FormDataContext = createContext();

export const FormDataProvider = ({ children }: { children: any }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    signUpConsent: true,
  });

  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};

export const useFormData = () => useContext(FormDataContext);
