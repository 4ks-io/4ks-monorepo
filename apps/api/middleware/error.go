package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

func ErrorHandler(ctx *gin.Context) {
	ctx.Next()

	if ctx.Errors != nil {
		for _, err := range ctx.Errors {
			log.Error().Caller().Err(err).Str("path", ctx.Request.URL.Path)
		}

		ctx.JSON(-1, ctx.Errors)
	}
}
