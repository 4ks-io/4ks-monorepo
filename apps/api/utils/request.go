package utils

import (
	"net/http"

	"4ks/apps/api/middleware"

	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/validator"
)

func ExtractClaimsFromRequest(request *http.Request) validator.ValidatedClaims {
	claims := request.Context().Value(jwtmiddleware.ContextKey{}).(*validator.ValidatedClaims)

	return *claims
}

func ExtractCustomClaimsFromClaims(claims *validator.ValidatedClaims) middleware.CustomClaims {
	customClaims := claims.CustomClaims.(*middleware.CustomClaims)

	return *customClaims
}
