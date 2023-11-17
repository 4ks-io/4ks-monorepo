import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useSessionContext } from '../../providers';
import { useNavigate } from 'react-router-dom';
import { usernameValidator } from '../../hooks/username-validator';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

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

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDisplayName(`${event.target.value}`);
  }

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    uValidator.setUsername(`${event.target.value}`);
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

  async function handleSave() {
    if (ctx?.actions?.createUser && uValidator.username) {
      try {
        await ctx?.actions?.createUser({
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
    <Container maxWidth="sm" style={{ paddingTop: 40 }}>
      <Typography variant="h4" component="h2">
        Choose an identity.
      </Typography>
      <Stack spacing={2} style={{ paddingTop: 40 }}>
        <TextField
          label="Name"
          value={displayName}
          onChange={handleNameChange}
        />
        <TextField
          error={validationErrorMsg ? true : false}
          label="Username"
          InputLabelProps={{
            shrink: true,
          }}
          value={uValidator.username}
          defaultValue={uValidator.username}
          helperText={validationErrorMsg}
          onChange={handleUsernameChange}
          // deferredValidationTime={1000}
        />
        <Typography variant="body1" component="h2">
          <ul>
            <li>Username must be minimum 8 and maximum 24 characters.</li>
            <li>
              It may only contain alphanumeric characters or non-consecutive
              hyphens.
            </li>
            <li>It cannot begin or end with a hyphen.</li>
          </ul>
        </Typography>
        <Button
          variant="contained"
          disabled={!isAuthenticated || disableSaveUsername}
          onClick={handleSave}
        >
          Save
        </Button>
      </Stack>
    </Container>
  );
};

export default NewUser;
