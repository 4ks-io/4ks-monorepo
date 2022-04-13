package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.GET("/recipes", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Yolo",
		})
	})
	r.POST("/recipes", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong222",
		})
	})
	r.GET("/recipes/:recipeId", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "yolo",
		})
	})
	r.POST("/recipes/:recipeId/star", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong2222",
		})
	})
	r.POST("/recipes/:recipeId/fork", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong222",
		})
	})
	r.GET("/recipes/:recipeId/revisions", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong222",
		})
	})
	r.GET("/recipes/:recipeId/revisions/:revisionId", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong222",
		})
	})

	r.GET("/ready", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong222",
		})
	})
	r.Run("0.0.0.0:5000") // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
