import React, { useEffect } from 'react';
import { useSessionContext } from '../../providers/session-context';
import { PageLayout } from '../Layout';
import { TextField } from '@fluentui/react/lib/TextField';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Settings = () => {
  const ctx = useSessionContext();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const [username, setUsername] = React.useState(ctx.user?.username);
  const [validationErrorMsg, setValidationErrorMsg] = React.useState('');
  const [saveUsernameDisabled, setSaveUsernameDisabled] = React.useState(true);

  useEffect(() => setUsername(ctx.user?.username), [ctx.user]);

  function handleUsernameChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) {
    setUsername(`${newValue}`);
    // console.log('handleUsernameChange');
    ctx.api?.users
      .getUsersUsername(encodeURI(`${newValue}`))
      .then((d) => {
        if (!!d) {
          setValidationErrorMsg('');
          setSaveUsernameDisabled(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setValidationErrorMsg('Invalid username or username already in use');
        setSaveUsernameDisabled(false);
      });
  }

  function handleUpdateUsername() {}

  if (!isAuthenticated) {
    navigate('/');
  }

  const disableSave =
    !ctx.user || saveUsernameDisabled || ctx.user.username == username;

  return (
    <PageLayout>
      <h2>Settings</h2>
      <p>
        Current Username: <b>{ctx.user?.username}</b>
      </p>

      <TextField
        errorMessage={validationErrorMsg}
        label="Username"
        deferredValidationTime={1000}
        value={username}
        onChange={handleUsernameChange}
      />
      <ul>
        <li>Username must be minimum 4 and maximum 16 characters.</li>
        <li>It may only contain alphanumeric characters or single hyphens.</li>
        <li>It cannot begin or end with a hyphen.</li>
      </ul>
      <p>
        <b>Renaming may take a few minutes to complete.</b>
      </p>
      <DefaultButton
        text="Save"
        disabled={!disableSave}
        onClick={handleUpdateUsername}
      />
    </PageLayout>
  );
};

export default Settings;
