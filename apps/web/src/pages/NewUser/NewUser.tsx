import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { TextField } from '@fluentui/react/lib/TextField';
import { useSessionContext } from '../../providers/session-context';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useNavigate } from 'react-router-dom';
import { usernameValidator } from '../../hooks/username-validator';

const NewUser: React.FunctionComponent = () => {
  const { user, isAuthenticated, logout } = useAuth0();
  const ctx = useSessionContext();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = React.useState<string>('');
  // const [country, setCountry] = React.useState<string>();
  // const [locale, setLocale] = React.useState<string>();
  const [validationErrorMsg, setValidationErrorMsg] = React.useState('');
  const [disableSaveUsername, setDisableSaveUsername] = React.useState(true);
  const uValidator = usernameValidator();

  useEffect(() => {
    setValidationErrorMsg(uValidator.feedbackMsg);
    setDisableSaveUsername(
      uValidator.username == ctx.user?.username || !uValidator.isValid
    );
  }, [uValidator]);

  function handleNameChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) {
    setDisplayName(`${newValue}`);
  }

  function handleUsernameChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) {
    uValidator.setUsername(`${newValue}`);
  }

  useEffect(() => {
    if (user?.name) {
      uValidator.setUsername(`${user?.name?.replace(' ', '-')}`);
      setDisplayName(`${user?.name}`);
    }
    // if (user?.locale) {
    //   setCountry(`${user?.locale}`);
    //   setLocale(`${user?.locale}`);
    // }
  }, [user]);

  useEffect(() => {
    if (ctx.user) {
      const callbackPath = localStorage.getItem('locationPathname') || '/';
      navigate(callbackPath);
    }
  }, [ctx.user]);

  function handleSave() {
    console.log(ctx.actions);
    if (ctx?.actions?.createUser && uValidator.username) {
      try {
        ctx?.actions?.createUser({
          username: uValidator.username,
          displayName,
        });
      } catch {
        console.error(`failed to create user`);
        logout();
      }
    }
  }

  return (
    <>
      <TextField label="Name" value={displayName} onChange={handleNameChange} />
      {/* <TextField
        label="Country"
        value={country}
        onChange={handleCountryChange}
      />
      <TextField
        label="Prefered Locale"
        value={locale}
        onChange={handleLocaleChange}
      /> */}
      <TextField
        label="Username"
        value={uValidator.username}
        deferredValidationTime={1000}
        errorMessage={validationErrorMsg}
        onChange={handleUsernameChange}
      />
      <ul>
        <li>Username must be minimum 8 and maximum 16 characters.</li>
        <li>It may only contain alphanumeric characters or single hyphens.</li>
        <li>It cannot begin or end with a hyphen.</li>
      </ul>

      <PrimaryButton
        text="Save"
        disabled={!isAuthenticated || disableSaveUsername}
        onClick={handleSave}
      />
    </>
  );
};

export default NewUser;
