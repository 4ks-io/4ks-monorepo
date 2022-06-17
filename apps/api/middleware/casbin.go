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

var VERBOSE = true

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
var rbac = "apps/api/casbin/model-rbac.conf"
var abacAuthor = "apps/api/casbin/model-abac-author.conf"
var abacContributor = "apps/api/casbin/model-abac-contributor.conf"
var policy = "apps/api/casbin/policy.csv"

func enforce(sub string, obj string, act string) (bool, error) {

	// m, _ := os.ReadFile(model)
	// fmt.Println(string(m))
	// p, _ := os.ReadFile(policy)
	// fmt.Println(string(p))

	// var enforcer = NewEnforcer(model, policy)
	e, err := casbin.NewEnforcer(rbac, policy)

	// EnforceContext{"r1","p1","e1","m1"}

	// type EnforceContext struct {
	//     RType string
	//     PType string
	//     EType string
	//     MType string
	// }

	err = e.LoadPolicy()
	if err != nil {
		return false, fmt.Errorf("failed to load policy from DB: %w", err)
	}

	//  enforcer.Enforce(sub, obj, act)
	ok, err := e.Enforce(sub, obj, act, VERBOSE)
	if err != nil {
		return false, fmt.Errorf("failed to enforce policy: %w", err)
	}

	fmt.Println("ENFORCE! : ", sub, " + ", obj, " + ", act, " = ", ok)

	return ok, nil
	// return true, nil
}

func nameIdList(data *[]models.UserSummary) []string {
	var list []string
	for _, user := range *data {
		list = append(list, user.Id)
	}
	return list
}

func EnforceContributor(sub *string, obj *[]models.UserSummary) (bool, error) {
	fmt.Println("EnforceContributor!!!")

	e, err := casbin.NewEnforcer(abacContributor, VERBOSE)
	if err != nil {
		return false, fmt.Errorf("failed to create enforcer: %w", err)
	}

	err = e.LoadPolicy()
	if err != nil {
		return false, fmt.Errorf("failed to load policy from DB: %w", err)
	}

	strs := nameIdList(obj)
	fmt.Println(strs)

	// convert string[] to interface
	data := make([]interface{}, len(strs))
	for i, s := range strs {
		data[i] = s
	}
	fmt.Println(data)

	// eCtx := casbin.NewEnforceContext("1")
	// fmt.Println(eCtx)
	ok, err := e.Enforce(*sub, data)
	if err != nil {
		fmt.Errorf("failed to enforce policy: %w", err)
		// return false, fmt.Errorf("failed to enforce policy: %w", err)
	}
	// ok := false
	// print(err)

	// []interface{}{"alice", "bob"}

	fmt.Println("ENFORCE! : ", *sub, " + ", data, " = ", ok)

	return ok, nil
	// return true, nil
}

func EnforceAuthor(sub *string, obj *models.UserSummary) (bool, error) {
	// fmt.Println("EnforceAuthor!!!")

	e, err := casbin.NewEnforcer(abacAuthor, VERBOSE)
	if err != nil {
		return false, fmt.Errorf("failed to create enforcer: %w", err)
	}

	err = e.LoadPolicy()
	if err != nil {
		return false, fmt.Errorf("failed to load policy from DB: %w", err)
	}

	// eCtx := casbin.NewEnforceContext("1")
	// fmt.Println(eCtx)
	ok, err := e.Enforce(*sub, obj)
	if err != nil {
		return false, fmt.Errorf("failed to enforce policy: %w", err)
	}
	// print(err)

	fmt.Println("ENFORCE! : ", *sub, " + ", obj.Id, " = ", ok)

	return ok, nil
	// return true, nil
}
