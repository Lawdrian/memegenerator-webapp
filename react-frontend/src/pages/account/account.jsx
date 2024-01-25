import React, { useState } from 'react';
import SignInSignUp from './SignInSignUp';
import MyAccount from "./MeinBereich";

import { useSelector } from 'react-redux';
import MainView from '../../components/Statistics/MainView';

export default function Account() {
  const [setProfile] = useState(null);

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
  };

  const user = useSelector((state) => state.user.currentUser);

  return (
    <div>
      <MainView />
      {user ? (
        <MyAccount />
      ) : (
        <SignInSignUp updateProfile={updateProfile} />
      )}
    </div>
  );
}
