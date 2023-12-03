package middleware

import (
	"context"
	"os"

	"net/http"
	"net/url"
	"time"

	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/jwks"
	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

var (
	domain   = os.Getenv("AUTH0_DOMAIN")
	audience = os.Getenv("AUTH0_AUDIENCE")
)

// CustomClaims contains custom data we want from the token.
type CustomClaims struct {
	Scope       string `json:"scope"`
	Email       string `json:"https://4ks.io/email"`
	ID          string `json:"https://4ks.io/id"`
	Timezone    string `json:"https://4ks.io/timeZone"`
	CountryCode string `json:"https://4ks.io/countryCode"`
}

// Validate does nothing for this example, but we need
// it to satisfy validator.CustomClaims interface.
func (c CustomClaims) Validate(_ context.Context) error {
	return nil
}

// ExtractClaimsFromRequest extracts the claims from the request
func ExtractClaimsFromRequest(request *http.Request) validator.ValidatedClaims {
	return *request.Context().Value(jwtmiddleware.ContextKey{}).(*validator.ValidatedClaims)
}

// ExtractCustomClaimsFromClaims extracts the custom claims from the claims
func ExtractCustomClaimsFromClaims(claims *validator.ValidatedClaims) CustomClaims {
	return *claims.CustomClaims.(*CustomClaims)
}

// AppendCustomClaims is a middleware that will append custom claims to the context.
func AppendCustomClaims() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// log.Debug().Caller().Msgf("access_token: %s", ctx.Request.Header["Authorization"])

		// add auth ID to context
		claims := ExtractClaimsFromRequest(ctx.Request)
		ctx.Set("authID", claims.RegisteredClaims.Subject)

		// custom clais
		customClaims := ExtractCustomClaimsFromClaims(&claims)
		ctx.Set("id", customClaims.ID)
		ctx.Set("email", customClaims.Email)

		// log.Debug().Caller().
		// 	Str("authID", claims.RegisteredClaims.Subject).
		// 	Str("id", customClaims.ID).
		// 	Str("email", customClaims.Email).
		// 	Msg("custom claims")

		ctx.Next()
	}
}

// EnforceJWT is a middleware that will check the validity of our JWT.
// todo: could this (already curriend) function be curried to pass in audience and domain?
// see https://github.com/cool8sniper/gin-rest-gorm-rbac-sample/blob/master/middleware/jwt.go
func EnforceJWT() func(next http.Handler) http.Handler {
	// log.Debug().Caller().Str("domain", domain).Str("audience", audience).Msg("EnforceJWT")
	issuerURL, err := url.Parse("https://" + domain + "/")
	if err != nil {
		log.Error().Err(err).Caller().Msg("Failed to parse the issuer url")
		panic(err)
	}

	provider := jwks.NewCachingProvider(issuerURL, 5*time.Minute)

	jwtValidator, err := validator.New(
		provider.KeyFunc,
		validator.RS256,
		issuerURL.String(),
		[]string{audience},
		validator.WithCustomClaims(
			func() validator.CustomClaims {
				return &CustomClaims{}
			},
		),
		validator.WithAllowedClockSkew(time.Minute),
	)
	if err != nil {
		log.Error().Err(err).Caller().Msg("Failed to set up the jwt validator")
	}

	errorHandler := func(w http.ResponseWriter, r *http.Request, err error) {
		log.Error().Caller().Err(err).Msg("failed to validate JWT")
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"message":"Failed to validate JWT."}`))
	}

	middleware := jwtmiddleware.New(
		jwtValidator.ValidateToken,
		jwtmiddleware.WithErrorHandler(errorHandler),
	)

	return func(next http.Handler) http.Handler {
		return middleware.CheckJWT(next)
	}
}
