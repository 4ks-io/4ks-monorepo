package controllers

import models "4ks/libs/go/models"

func createMockBanner(f string, u string) []models.RecipeMediaVariant {
	a := []models.RecipeMediaVariant{}
	a = append(a, models.RecipeMediaVariant{
		MaxWidth: 256,
		Url:      u,
		Filename: f,
		Alias:    "sm",
	})
	a = append(a, models.RecipeMediaVariant{
		MaxWidth: 1024,
		Url:      u,
		Filename: f,
		Alias:    "md",
	})
	return a
}