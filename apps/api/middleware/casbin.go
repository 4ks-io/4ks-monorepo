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
		sub := customClaims.Id

		ok, err := enforce(sub, obj, act)
		//ok, err := enforce(val.(string), obj, act, adapter)
		if err != nil {
			log.Println(err)
			c.AbortWithStatusJSON(500, "authorization error")
			return
		}
		if !ok {
			c.AbortWithStatusJSON(403, "forbidden")
			return
		}
		c.Next()
	}
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}

// where should this be declared?
var model = "apps/api/casbin/model.conf"
var policy = "apps/api/casbin/policy.csv"

func enforce(sub string, obj string, act string) (bool, error) {

	// m, _ := os.ReadFile(model)
	// fmt.Println(string(m))
	// p, _ := os.ReadFile(policy)
	// fmt.Println(string(p))

	var enforcer = casbin.NewEnforcer(model, policy)

	// EnforceContext{"r1","p1","e1","m1"}

	// type EnforceContext struct {
	//     RType string
	//     PType string
	//     EType string
	//     MType string
	// }

	err := enforcer.LoadPolicy()
	if err != nil {
		return false, fmt.Errorf("failed to load policy from DB: %w", err)
	}

	//  enforcer.Enforce(sub, obj, act)
	ok := enforcer.Enforce(sub, obj, act)

	fmt.Println("ENFORCE! : ", sub, " + ", obj, " + ", act, " = ", ok)

	return ok, nil
	// return true, nil
}
