import React, { useEffect } from 'react';
import { useSessionContext } from '../../providers';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { usernameValidator } from '../../hooks/username-validator';
import { dtos_UpdateUser } from '@4ks/api-fetch';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

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
    const isCurrentUsername =
      uValidator.username?.toLowerCase() == ctx.user?.username?.toLowerCase();
    setValidationErrorMsg(uValidator.feedbackMsg);
    setDisableSaveUsername(isCurrentUsername || !uValidator.isValid);
  }, [uValidator]);

  if (!isAuthenticated) {
    navigate('/');
  }

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    uValidator.setUsername(`${event.target.value}`);
  }

  async function handleUpdateUsername() {
    if (uValidator.username && ctx.actions.updateUser && ctx.user?.id) {
      const data: dtos_UpdateUser = { username: uValidator.username };
      ctx.actions.updateUser(ctx.user?.id, data);
    }
  }

  const disableSave = !ctx.user || disableSaveUsername;

  return (
    <Container maxWidth="sm" style={{ paddingTop: 40 }}>
      <Typography variant="h4" component="h2">
        Settings
      </Typography>
      <Stack spacing={2} style={{ paddingTop: 40 }}>
        <Typography variant="subtitle1" component="h2">
          Email: {ctx.user?.emailAddress}
        </Typography>
        <Typography variant="subtitle1" component="h2">
          Current Username: {ctx.user?.username}
        </Typography>
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
        <Typography variant="subtitle2" component="h2">
          <b>Renaming may take a few minutes to complete.</b>
        </Typography>
        <Button
          variant="contained"
          disabled={disableSave}
          onClick={handleUpdateUsername}
        >
          Save
        </Button>
      </Stack>
    </Container>
  );
};

export default Settings;
