// Same as libs/go/models/recipe-media-status.go

package function

type MediaStatus int

const (
	MediaStatusRequested                  MediaStatus = 0
	MediaStatusProcessing                 MediaStatus = 1
	MediaStatusReady                      MediaStatus = 2
	MediaStatusErrorUnknown               MediaStatus = 60
	MediaStatusErrorSize                  MediaStatus = 61
	MediaStatusErrorMissingAttr           MediaStatus = 62
	MediaStatusErrorInvalidMIMEType       MediaStatus = 63
	MediaStatusErrorVision                MediaStatus = 64
	MediaStatusErrorSafeSearch            MediaStatus = 65
	MediaStatusErrorInappropriateAdult    MediaStatus = 70
	MediaStatusErrorInappropriateMedical  MediaStatus = 71
	MediaStatusErrorInappropriateViolence MediaStatus = 72
	MediaStatusErrorInappropriateRacy     MediaStatus = 73
	MediaStatusErrorFailedCopy            MediaStatus = 80
	MediaStatusErrorFailedResize          MediaStatus = 81
	MediaStatusErrorFailedVariant         MediaStatus = 82
)
