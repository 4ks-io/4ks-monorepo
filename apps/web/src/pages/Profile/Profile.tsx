import React from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  let { userName } = useParams();

  return <h2>Profile for {userName}</h2>;
};

export default Profile;
