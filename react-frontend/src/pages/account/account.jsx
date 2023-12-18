import React, { useState } from 'react';
import Sign_in_and_up from './login';
import MyAccount from "./meinBereich";

import { useDispatch, useSelector } from 'react-redux';

export default function Account() {
  const [profile, setProfile] = useState(null);

  // Funktion zum Aktualisieren des Zustands in Account
  const updateProfile = (newProfile) => {
    setProfile(newProfile);
    console.log("Willkommen " + newProfile.email);
  };

  const user = useSelector((state) => state.user.currentUser);

  return (
    <div>
      {user ? (
        <MyAccount />
      ) : (
        <Sign_in_and_up updateProfile={updateProfile} />
      )}
    </div>
  );
}
