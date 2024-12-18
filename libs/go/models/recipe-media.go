package models

import "time"

type MediaBestUse int

const (
	MediaBestUseGeneral     MediaBestUse = 0
	MediaBestUseIngredient  MediaBestUse = 1
	MediaBestUseInstruction MediaBestUse = 2
)

type RecipeMediaVariant struct {
	MaxWidth int    `firestore:"maxWidth" json:"maxWidth"`
	URL      string `firestore:"url" json:"url"`
	Filename string `firestore:"filename" json:"filename"`
	Alias    string `firestore:"alias" json:"alias"`
}

type RecipeMedia struct {
	ID           string               `firestore:"id" json:"id"`
	Variants     []RecipeMediaVariant `firestore:"variants" json:"variants"`
	ContentType  string               `firestore:"contentType" json:"contentType"`
	RecipeId     string               `firestore:"recipeId" json:"recipeId"`
	RootRecipeId string               `firestore:"rootRecipeId" json:"rootRecipeId"`
	OwnerId      string               `firestore:"ownerId" json:"ownerId"`
	Status       MediaStatus          `firestore:"status" json:"status"`
	BestUse      MediaBestUse         `firestore:"bestUse" json:"bestUse"`
	CreatedDate  time.Time            `firestore:"createdDate" json:"createdDate"`
	UpdatedDate  time.Time            `firestore:"updatedDate" json:"updatedDate"`
}

type CreateRecipeMedia struct {
	RecipeMedia RecipeMedia `json:"recipeMedia"`
	SignedURL   string      `json:"signedURL"`
}
