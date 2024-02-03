import React, { useState } from 'react';
import SignInSignUp from './SignInSignUp';
import MyAccount from "./MyAccount";

import { useSelector } from 'react-redux';
import StatisticCreatedMemes from '../../components/Statistics/StatisticCreatedMemes';

export default function Account() {
  const [setProfile] = useState(null);

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
  };

  const user = useSelector((state) => state.user.currentUser);

  return (
    <div>
      <StatisticCreatedMemes />
      {user ? (
        <MyAccount />
      ) : (
        <SignInSignUp updateProfile={updateProfile} />
      )}
    </div>
  );
}
