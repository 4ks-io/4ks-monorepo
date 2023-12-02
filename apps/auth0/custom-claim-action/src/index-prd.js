/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const sha256 = require('sha256');
  const namespace = 'https://4ks.io';

  if (event.authorization) {
    api.accessToken.setCustomClaim(`${namespace}/email`, event.user.email);
    api.accessToken.setCustomClaim(
      `${namespace}/id`,
      sha256(`${namespace}/${event.user.email}`)
    );
    api.accessToken.setCustomClaim(
      `${namespace}/timeZone`,
      event.request.geoip.timeZone
    );
    api.accessToken.setCustomClaim(
      `${namespace}/countryCode`,
      event.request.geoip.countryCode3
    );
    // api.accessToken.setCustomClaim(`${namespace}/language`, event.request.geoip.language);
  }
};

/**
 * Handler that will be invoked when this action is resuming after an external redirect. If your
 * onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
// exports.onContinuePostLogin = async (event, api) => {
// };
