import React, { createContext, useContext } from "react";

// Definiši tip podatka koji se očekuje
const UserContext = createContext({
  uid: null,
  email: null,
  age: null,
  gender: null,
  height: null,
  weight: null,
  name: null,
  surname: null,
  profilePicture: null,
  dijabetes: null,
});

export const UserProvider = ({ children, value }) => (
  <UserContext.Provider value={value}>{children}</UserContext.Provider>
);

export const useUser = () => useContext(UserContext);
