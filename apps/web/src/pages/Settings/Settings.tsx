import React from 'react';
import { useSessionContext } from '../../providers/session-context';
import { PageLayout } from '../Layout';
import { TextField } from '@fluentui/react/lib/TextField';

const Settings = () => {
  const ctx = useSessionContext();
  const [username, setUsername] = React.useState(ctx.user?.username);
  const [validationErrorMsg, setValidationErrorMsg] = React.useState('');

  function handleUsernameChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) {
    setUsername(`${newValue}`);
    console.log('handleUsernameChange');
    try {
      ctx.api?.users
        .getUsersUsername(encodeURI(`${newValue}`))
        .then((d) => setValidationErrorMsg(d ? 'Username alread in use' : ''));
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <PageLayout>
      <h2>Settings</h2>
      <p>username: {ctx.user?.username}</p>

      <TextField
        errorMessage={validationErrorMsg}
        label="Username"
        deferredValidationTime={1000}
        value={username}
        onChange={handleUsernameChange}
      />
      <p>
        Username may only contain alphanumeric characters or single hyphens, and
        cannot begin or end with a hyphen. Renaming may take a few minutes to
        complete.
      </p>
    </PageLayout>
  );
};

export default Settings;
