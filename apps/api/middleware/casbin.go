package middleware

import (
	"fmt"
	"log"

	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/casbin/casbin"
	"github.com/gin-gonic/gin"
)

// Authorize determines if current subject has been authorized to take an action on an object.
func Authorize(obj string, act string) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims := c.Request.Context().Value(jwtmiddleware.ContextKey{}).(*validator.ValidatedClaims)
		customClaims := claims.CustomClaims.(*CustomClaims)
		sub := customClaims.Email

		// // casbin enforces policy
		ok, err := enforce(sub, obj, act)
		//ok, err := enforce(val.(string), obj, act, adapter)
		if err != nil {
			log.Println(err)
			c.AbortWithStatusJSON(500, "error occurred when authorizing user")
			return
		}
		if !ok {
			c.AbortWithStatusJSON(403, "forbidden")
			return
		}
		c.Next()
	}
}

func enforce(sub string, obj string, act string) (bool, error) {
	enforcer := casbin.NewEnforcer("apps/api/config/model.conf", "apps/api/config/policy.csv")
	err := enforcer.LoadPolicy()
	if err != nil {
		return false, fmt.Errorf("failed to load policy from DB: %w", err)
	}
	fmt.Println(sub)
	fmt.Println(obj)
	fmt.Println(act)
	//  enforcer.Enforce(sub, obj, act)
	ok := enforcer.Enforce(sub, obj, act)
	fmt.Println(ok)
	return ok, nil
	// return true, nil
}