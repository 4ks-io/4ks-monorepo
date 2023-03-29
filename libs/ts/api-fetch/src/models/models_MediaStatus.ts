/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export enum models_MediaStatus {
    MediaStatusRequested = 0,
    MediaStatusProcessing = 1,
    MediaStatusReady = 2,
    MediaStatusErrorUnknown = 60,
    MediaStatusErrorSize = 61,
    MediaStatusErrorMissingAttr = 62,
    MediaStatusErrorInvalidMIMEType = 63,
    MediaStatusErrorVision = 64,
    MediaStatusErrorSafeSearch = 65,
    MediaStatusErrorInappropriateAdult = 70,
    MediaStatusErrorInappropriateMedical = 71,
    MediaStatusErrorInappropriateViolence = 72,
    MediaStatusErrorInappropriateRacy = 73,
    MediaStatusErrorFailedCopy = 80,
    MediaStatusErrorFailedResize = 81,
    MediaStatusErrorFailedVariant = 82,
}