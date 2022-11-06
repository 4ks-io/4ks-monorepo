package media

import (
	"context"
	"errors"
)

var ctx = context.Background()

var (
	ErrTargetNotFound      = errors.New("unable to get token")
)

type MediaService interface {
	GetToken() (*string, error)
}

type mediaService struct {
}

func New() MediaService {
	return &mediaService{}
}

func (us mediaService) GetToken() (*string, error) {

	s := ""
	return &s, nil
}
