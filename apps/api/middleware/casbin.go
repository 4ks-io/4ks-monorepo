package middleware

import (
	"4ks/libs/go/models"
	"fmt"
	"os"

	"github.com/casbin/casbin/v2"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

// VERBOSE is a bool that determines if casbin should be verbose
// tr@ck: replace with debug from main
var VERBOSE = false

var (
	en *casbin.Enforcer
)

func init() {
	var err error
	en, err = casbin.NewEnforcer(model, policy, VERBOSE)
	if err != nil {
		log.Fatal().Err(err).Caller().Msg("failed to create enforcer")
		os.Exit(1)
	}
}

// where should this be declared?
const (
	model  = "apps/api/casbin/model.conf"
	policy = "apps/api/casbin/policy.csv"
)

// Enforce RBAC
func Enforce(sub string, obj string, act string) (bool, error) {
	if err := en.LoadPolicy(); err != nil {
		return false, fmt.Errorf("failed to load policy: %w", err)
	}

	ok, err := en.Enforce(sub, obj, act)
	if err != nil {
		return false, fmt.Errorf("failed to enforce policy: %w", err)
	}

	return ok, nil
}

// ABAC Author
var c2 = casbin.NewEnforceContext("2")

// EnforceAuthor determines if current subject has been authorized
func EnforceAuthor(sub string, obj models.UserSummary) (bool, error) {
	// eCtx := casbin.NewEnforceContext("2")
	// fmt.Println(eCtx)
	if err := en.LoadPolicy(); err != nil {
		return false, fmt.Errorf("failed to load policy: %w", err)
	}

	ok, err := en.Enforce(c2, sub, obj)
	if err != nil {
		return false, fmt.Errorf("failed to enforce policy: %w", err)
	}

	return ok, nil
}

// ABAC Contributor
var c3 = casbin.EnforceContext{
	RType: "r2",
	PType: "p2",
	EType: "e2",
	MType: "m3",
}

// EnforceContributor determines if current subject has been authorized
// to take an action on an object.
func EnforceContributor(sub string, obj []models.UserSummary) (bool, error) {
	// eCtx := casbin.NewEnforceContext("2")
	// eCtx.MType = "m3"
	// fmt.Println(c3)
	if err := en.LoadPolicy(); err != nil {
		return false, fmt.Errorf("failed to load policy: %w", err)
	}

	data := getIds(obj)

	ok, err := en.Enforce(c3, sub, data)
	if err != nil {
		// fmt.Errorf("failed to enforce policy: %w", err)
		return false, fmt.Errorf("failed to enforce policy: %w", err)
	}

	return ok, nil
}

// getIds converts array of UserSummary models into string array of ids
func getIds(data []models.UserSummary) []interface{} {
	// var list []string
	list := []string{}
	for _, user := range data {
		list = append(list, user.ID)
	}

	out := make([]interface{}, len(list))
	for i, s := range list {
		out[i] = s
	}

	return out
}

// Authorize determines if current subject has been authorized to take an action on an object.
func Authorize(obj string, act string) gin.HandlerFunc {
	return func(c *gin.Context) {
		sub := c.GetString("id")
		ok, err := Enforce(sub, obj, act)
		//ok, err := enforce(val.(string), obj, act, adapter)
		if err != nil {
			log.Error().Err(err).Caller().Msg("authorization error")
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
