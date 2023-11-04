package utils

import (
	"encoding/json"
	"fmt"
)

// PrintStruct prints a struct
func PrintStruct(t interface{}) {
	j, _ := json.MarshalIndent(t, "", "  ")
	fmt.Println(string(j))
}
