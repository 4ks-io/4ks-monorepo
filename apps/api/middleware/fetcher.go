package middleware

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/hex"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

func decrypt(encrypted string, key []byte) (string, error) {
	ciphertext, err := hex.DecodeString(encrypted)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	if len(ciphertext) < aes.BlockSize {
		return "", fmt.Errorf("ciphertext too short")
	}
	iv := ciphertext[:aes.BlockSize]
	ciphertext = ciphertext[aes.BlockSize:]

	stream := cipher.NewCFBDecrypter(block, iv)
	stream.XORKeyStream(ciphertext, ciphertext)

	return string(ciphertext), nil
}

// AuthorizeFetcher validates the request has been authorized to fetch
func AuthorizeFetcher() gin.HandlerFunc {
	secret, ok := os.LookupEnv("API_FETCHER_PSK")
	if !ok {
		log.Fatal().Msg("API_FETCHER_PSK required")
	}
	key := []byte(secret)

	return func(c *gin.Context) {
		// get the authorization header
		h := c.Request.Header["X-4ks-Auth"][0]
		if h == "" {
			msg := "missing auth header"
			log.Error().Err(errors.New(msg)).Msgf("authorization error: %s", msg)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"msg": msg})
			return
		}

		// decrypt the header
		decrypted, err := decrypt(h, key)
		if err != nil {
			msg := "failed to decrypt"
			log.Error().Err(err).Msgf("authorization error: %s", msg)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"msg": msg})
			return
		}

		// parse the decrypted time
		decryptedTime, err := time.Parse(time.RFC3339, decrypted)
		if err != nil {
			msg := "failed to parse timestamp"
			log.Error().Err(err).Msgf("authorization error: %s", msg)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"msg": msg})
			return
		}

		if time.Since(decryptedTime).Seconds() >= 10 {
			msg := "expired"
			log.Error().Err(err).Msgf("authorization error: %s", msg)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"msg": msg})
			return
		}

		// sub := c.GetString("sub")
		// fmt.Println(sub)
		// ok, err := Enforce(sub, obj, act)
		// //ok, err := enforce(val.(string), obj, act, adapter)
		// if err != nil {
		// 	log.Error().Err(err).Msg("authorization error")
		// 	c.AbortWithStatusJSON(500, "authorization error")
		// 	return
		// }
		// if !ok {
		// 	c.AbortWithStatusJSON(403, "forbidden")
		// 	return
		// }
		c.Next()
	}
}
