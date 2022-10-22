import { useState, useEffect } from 'react';
import { useSessionContext } from '../providers/session-context';
import { useAuth0 } from '@auth0/auth0-react';

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
    if (isAuthenticated && user && username) {
      const isValideUsername = testUsername(username);
      if (!isValideUsername) {
        setIsValid(false);
        setFeedbackMsg('Invalid username');
      } else if (username == ctx.user?.username) {
        setIsValid(true);
        setFeedbackMsg('');
      } else {
        ctx.api?.users
          .getUsersUsername(encodeURI(username))
          .then((d) => {
            if (!!d) {
              setIsValid(true);
              setFeedbackMsg('');
            }
          })
          .catch((e) => {
            setIsValid(false);
            setFeedbackMsg('Username already in use');
          });
      }
    }
  }, [username]);

  return {
    setUsername,
    username,
    isValid,
    feedbackMsg,
  };
}
