import React, { useState } from 'react';
import SignInSignUp from './SignInSignUp';
import MyAccount from "./MyAccount";

import { useSelector } from 'react-redux';
import GeneralStatistics from '../../components/Statistics/StatisticCreatedMemes';

export default function Account() {
  const [setProfile] = useState(null);

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
  };

  const user = useSelector((state) => state.user.currentUser);

  return (
    <div>
      {user ? (
        <div>
          <GeneralStatistics />
          <MyAccount />
        </div>
      ) : (
        <SignInSignUp updateProfile={updateProfile} />
      )}
    </div>
  );
}
