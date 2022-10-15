import React from 'react';
import { PageLayout } from '../Layout';
import { useParams } from 'react-router-dom';

const Profile = () => {
  let { userName } = useParams();

  return (
    <PageLayout>
      <h2>Profile for {userName}</h2>
    </PageLayout>
  );
};

export default Profile;
