package middleware

import "github.com/gin-gonic/gin"

// CorsMiddleware adds CORS headers to the response
func CorsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// tr@ck: fix url
		c.Writer.Header().Set("Access-Control-Allow-Origin", "https://www.4ks.io")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Content-Length")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
		} else {
			c.Next()
		}
	}
}
