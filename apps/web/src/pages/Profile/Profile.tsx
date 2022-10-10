import React from 'react';
import { PageLayout } from '../Layout';
import { useParams } from 'react-router-dom';

const Profile = () => {
  let { username } = useParams();

  return (
    <PageLayout>
      <h2>Profile for {username}</h2>
    </PageLayout>
  );
};

export default Profile;
