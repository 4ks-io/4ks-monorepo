package models

import "time"

type MediaBestUse int

const (
	MediaBestUseGeneral     MediaBestUse = 0
	MediaBestUseIngredient  MediaBestUse = 1
	MediaBestUseInstruction MediaBestUse = 2
)

type MediaStatus int

const (
	MediaStatusRequested  MediaStatus = 0
	MediaStatusProcessing MediaStatus = 1
	MediaStatusReady      MediaStatus = 2
)

type RecipeMedia struct {
	Id           string       `firestore:"id" json:"id"`
	Uri          string       `firestore:"uri" json:"uri"`
	FilenameSm   string       `firestore:"filenameSm" json:"filenameSm"`
	FilenameMd   string       `firestore:"filenameMd" json:"filenameMd"`
	Filename     string       `firestore:"filename" json:"filename"`
	ContentType  string       `firestore:"contentType" json:"contentType"`
	RecipeId     string       `firestore:"recipeId" json:"recipeId"`
	RootRecipeId string       `firestore:"rootRecipeId" json:"rootRecipeId"`
	OwnerId      string       `firestore:"ownerId" json:"ownerId"`
	Status       MediaStatus  `firestore:"status" json:"status"`
	BestUse      MediaBestUse `firestore:"bestUse" json:"bestUse"`
	CreatedDate  time.Time    `firestore:"createdDate" json:"createdDate"`
	UpdatedDate  time.Time    `firestore:"updatedDate" json:"updatedDate"`
}

type CreateRecipeMedia struct {
	RecipeMedia RecipeMedia `json:"recipeMedia"`
	SignedUrl   string      `json:"signedUrl"`
}
