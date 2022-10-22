import React, { useEffect } from 'react';
import { useSessionContext } from '../../providers/session-context';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { usernameValidator } from '../../hooks/username-validator';

const Settings = () => {
  const ctx = useSessionContext();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const [validationErrorMsg, setValidationErrorMsg] = React.useState('');
  const [disableSaveUsername, setDisableSaveUsername] = React.useState(true);
  const uValidator = usernameValidator();

  useEffect(
    () => uValidator.setUsername(`${ctx.user?.username}`),
    [ctx.user?.username]
  );

  useEffect(() => {
    setValidationErrorMsg(uValidator.feedbackMsg);
    setDisableSaveUsername(
      uValidator.username == ctx.user?.username || !uValidator.isValid
    );
  }, [uValidator]);

  if (!isAuthenticated) {
    navigate('/');
  }

  function handleUsernameChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) {
    uValidator.setUsername(`${newValue}`);
  }

  function handleUpdateUsername() {}

  const disableSave = !ctx.user || disableSaveUsername;

  return (
    <>
      <h2>Settings</h2>
      <p>
        Current Username: <b>{ctx.user?.username}</b>
      </p>

      <TextField
        errorMessage={validationErrorMsg}
        label="Username"
        deferredValidationTime={1000}
        value={uValidator.username}
        onChange={handleUsernameChange}
      />
      <ul>
        <li>Username must be minimum 8 and maximum 24 characters.</li>
        <li>It may only contain alphanumeric characters or single hyphens.</li>
        <li>It cannot begin or end with a hyphen.</li>
      </ul>
      <p>
        <b>Renaming may take a few minutes to complete.</b>
      </p>
      <PrimaryButton
        text="Save"
        disabled={disableSave}
        onClick={handleUpdateUsername}
      />
    </>
  );
};

export default Settings;
