package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Yolo",
		})
	})
	r.GET("/ready", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong222",
		})
	})

	r.Run("0.0.0.0:5000") // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
