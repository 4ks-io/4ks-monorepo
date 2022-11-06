import { useState, useEffect } from 'react';
import { useSessionContext } from '../providers/session-context';
import { useAuth0 } from '@auth0/auth0-react';
import { models_Username } from '@4ks/api-fetch';

interface IValidUsername {
  setUsername: (username: string) => void;
  username: string | undefined;
  isValid: boolean;
  feedbackMsg: string;
}

export function usernameValidator(): IValidUsername {
  const { user, isAuthenticated } = useAuth0();
  const ctx = useSessionContext();
  const [username, setUsername] = useState<string>();
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [isValid, setIsValid] = useState(true);

  const re: RegExp = /^[a-zA-Z0-9][a-zA-Z0-9-]{6,22}[a-zA-Z0-9]$/i;
  const invalidMsg = 'Invalid username or username already in use';

  function testUsername(username: string) {
    if (re.test(username)) {
      return username.includes('--') ? false : true;
    }
    return false;
  }

  useEffect(() => {
    if (!username || username == '') {
      setIsValid(false);
      setFeedbackMsg('Invalid username');
    }
    if (username) {
      const isValideUsername = testUsername(username);

      if (!isValideUsername) {
        setIsValid(false);
        setFeedbackMsg('Invalid username');
        return;
      }

      if (
        ctx.user?.username &&
        username.toLocaleLowerCase() == ctx.user?.username.toLocaleLowerCase()
      ) {
        setIsValid(true);
        setFeedbackMsg('');
        return;
      }

      ctx.api?.users
        .postUsersUsername({ username })
        .then((d: models_Username) => {
          setIsValid(d.valid);
          switch (d.msg) {
            case '':
              setFeedbackMsg('');
              break;
            case 'invalid':
              setFeedbackMsg('Invalid username');
              break;
            case 'unavailable':
              setFeedbackMsg('Username already in use');
              break;
            default:
              setFeedbackMsg('');
          }
        });
    }
  }, [username]);

  return {
    setUsername,
    username,
    isValid,
    feedbackMsg,
  };
}
