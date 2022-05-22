package auth

import (
	"net/http"

	"4ks/apps/api/authenticator"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

type AuthbackParams struct {
	Code string `form:"code`
	State string `form:"state`
}

// Handler for our callback.
func AuthbackHandler(auth *authenticator.Authenticator) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		session := sessions.Default(ctx)

		// fmt.Println(ctx.Request.URL.RawPath)
		// fmt.Println(ctx.Request.URL.RawQuery)

		// var authbackParams AuthbackParams
		// if ctx.Bind(&authbackParams) == nil {
		// 	log.Println("====== Bind By Query String ======")
		// 	log.Println(authbackParams.Code)
		// 	log.Println(authbackParams.State)
		// }

		// params := ctx.Request.URL.Query()
		// fmt.Println(params)
		// fmt.Println(ctx)
		// fmt.Println(session)
		// ctxState := ctx.Query("state")
		// sesState := session.Get("state")
		// fmt.Println(ctxState)
		// fmt.Println(sesState)



		if ctx.Query("state") != session.Get("state") {
			ctx.String(http.StatusBadRequest, "Invalid state parameter.")
			return
		}

		// Exchange an authorization code for a token.
		token, err := auth.Exchange(ctx.Request.Context(), ctx.Query("code"))
		if err != nil {
			ctx.String(http.StatusUnauthorized, "Failed to convert an authorization code into a token.")
			return
		}

		idToken, err := auth.VerifyIDToken(ctx.Request.Context(), token)
		if err != nil {
			ctx.String(http.StatusInternalServerError, "Failed to verify ID Token.")
			return
		}

		var profile map[string]interface{}
		if err := idToken.Claims(&profile); err != nil {
			ctx.String(http.StatusInternalServerError, err.Error())
			return
		}

		session.Set("access_token", token.AccessToken)
		session.Set("profile", profile)
		if err := session.Save(); err != nil {
			ctx.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Redirect to logged in page.
		ctx.Redirect(http.StatusTemporaryRedirect, "/api/profile")
	}
}