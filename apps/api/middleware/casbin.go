package middleware

import (
	"4ks/libs/go/models"
	"fmt"
	"log"

	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/casbin/casbin/v2"
	"github.com/gin-gonic/gin"
)

var VERBOSE = false

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
var e, err = casbin.NewEnforcer(model, policy, VERBOSE)

// if err != nil {
// 	fmt.Printf("failed to create enforcer: %w", err)
// 	// return false, fmt.Errorf("failed to create enforcer: %w", err)
// }

func enforce(sub string, obj string, act string) (bool, error) {
	err = e.LoadPolicy()
	if err != nil {
		return false, fmt.Errorf("failed to load policy: %w", err)
	}

	ok, err := e.Enforce(sub, obj, act)
	if err != nil {
		return false, fmt.Errorf("failed to enforce policy: %w", err)
	}

	return ok, nil
}

var c2 = casbin.NewEnforceContext("2")

func EnforceAuthor(sub *string, obj *models.UserSummary) (bool, error) {
	// eCtx := casbin.NewEnforceContext("2")
	// fmt.Println(eCtx)
	err = e.LoadPolicy()
	if err != nil {
		return false, fmt.Errorf("failed to load policy: %w", err)
	}

	ok, err := e.Enforce(c2, *sub, obj)
	if err != nil {
		return false, fmt.Errorf("failed to enforce policy: %w", err)
	}

	return ok, nil
}

var c3 = casbin.EnforceContext{
	RType: "r2",
	PType: "p2",
	EType: "e2",
	MType: "m3",
}

func EnforceContributor(sub *string, obj *[]models.UserSummary) (bool, error) {
	// eCtx := casbin.NewEnforceContext("2")
	// eCtx.MType = "m3"
	// fmt.Println(c3)
	err := e.LoadPolicy()
	if err != nil {
		return false, fmt.Errorf("failed to load policy: %w", err)
	}

	data := getIds(obj)

	ok, err := e.Enforce(c3, *sub, data)
	if err != nil {
		// fmt.Errorf("failed to enforce policy: %w", err)
		return false, fmt.Errorf("failed to enforce policy: %w", err)
	}

	return ok, nil
}

// convert array of UserSummary models into string array of ids
func getIds(data *[]models.UserSummary) []interface{} {
	var list []string
	for _, user := range *data {
		list = append(list, user.Id)
	}

	out := make([]interface{}, len(list))
	for i, s := range list {
		out[i] = s
	}

	return out
}
