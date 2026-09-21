package trick

import "time"

// Equipment 道具エンティティ
type Equipment struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	IsInvalid bool      `json:"-"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// CreateEquipmentRequest 道具登録リクエスト
type CreateEquipmentRequest struct {
	Name string `json:"name" validate:"required,min=1,max=64"`
}

// EquipmentResponse 道具レスポンス
type EquipmentResponse struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// ToResponse EquipmentをEquipmentResponseに変換
func (e *Equipment) ToResponse() *EquipmentResponse {
	return &EquipmentResponse{ID: e.ID, Name: e.Name, CreatedAt: e.CreatedAt, UpdatedAt: e.UpdatedAt}
}

// EquipmentCategory 道具カテゴリエンティティ
type EquipmentCategory struct {
	ID          int       `json:"id"`
	EquipmentID int       `json:"equipment_id"`
	Name        string    `json:"name"`
	IsInvalid   bool      `json:"-"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CreateEquipmentCategoryRequest 道具カテゴリ登録リクエスト
type CreateEquipmentCategoryRequest struct {
	EquipmentID int    `json:"equipment_id" validate:"required"`
	Name        string `json:"name" validate:"required,min=1,max=64"`
}

// EquipmentCategoryResponse 道具カテゴリレスポンス
type EquipmentCategoryResponse struct {
	ID          int       `json:"id"`
	EquipmentID int       `json:"equipment_id"`
	Name        string    `json:"name"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ToResponse EquipmentCategoryをEquipmentCategoryResponseに変換
func (c *EquipmentCategory) ToResponse() *EquipmentCategoryResponse {
	return &EquipmentCategoryResponse{ID: c.ID, EquipmentID: c.EquipmentID, Name: c.Name, CreatedAt: c.CreatedAt, UpdatedAt: c.UpdatedAt}
}

// State 状態エンティティ（道具単位で一本化。カテゴリでは区切らない）
type State struct {
	ID          int       `json:"id"`
	EquipmentID int       `json:"equipment_id"`
	Name        string    `json:"name"`
	Description *string   `json:"description,omitempty"`
	MediaURL    *string   `json:"media_url,omitempty"`
	IsInvalid   bool      `json:"-"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CreateStateRequest 状態登録リクエスト
type CreateStateRequest struct {
	EquipmentID int    `json:"equipment_id" validate:"required"`
	Name        string `json:"name" validate:"required,min=1,max=64"`
	Description string `json:"description,omitempty"`
	MediaURL    string `json:"media_url,omitempty"`
}

// StateResponse 状態レスポンス
type StateResponse struct {
	ID          int       `json:"id"`
	EquipmentID int       `json:"equipment_id"`
	Name        string    `json:"name"`
	Description *string   `json:"description,omitempty"`
	MediaURL    *string   `json:"media_url,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ToResponse StateをStateResponseに変換
func (s *State) ToResponse() *StateResponse {
	return &StateResponse{
		ID:          s.ID,
		EquipmentID: s.EquipmentID,
		Name:        s.Name,
		Description: s.Description,
		MediaURL:    s.MediaURL,
		CreatedAt:   s.CreatedAt,
		UpdatedAt:   s.UpdatedAt,
	}
}

// Trick 技エンティティ
type Trick struct {
	ID                       int       `json:"id"`
	EquipmentID              int       `json:"equipment_id"`
	CategoryID               int       `json:"category_id"`
	Name                     string    `json:"name"`
	Description              *string   `json:"description,omitempty"`
	StartStateID             int       `json:"start_state_id"`
	EndStateID               int       `json:"end_state_id"`
	VideoURL                 *string   `json:"video_url,omitempty"`
	EstimatedDurationSeconds int       `json:"estimated_duration_seconds"`
	IsInvalid                bool      `json:"-"`
	CreatedAt                time.Time `json:"created_at"`
	UpdatedAt                time.Time `json:"updated_at"`
}

// CreateTrickRequest 技登録リクエスト
type CreateTrickRequest struct {
	EquipmentID              int    `json:"equipment_id" validate:"required"`
	CategoryID               int    `json:"category_id" validate:"required"`
	Name                     string `json:"name" validate:"required,min=1,max=128"`
	Description              string `json:"description,omitempty"`
	StartStateID             int    `json:"start_state_id" validate:"required"`
	EndStateID               int    `json:"end_state_id" validate:"required"`
	VideoURL                 string `json:"video_url,omitempty"`
	EstimatedDurationSeconds int    `json:"estimated_duration_seconds" validate:"gte=0"`
}

// TrickResponse 技レスポンス
type TrickResponse struct {
	ID                       int       `json:"id"`
	EquipmentID              int       `json:"equipment_id"`
	CategoryID               int       `json:"category_id"`
	Name                     string    `json:"name"`
	Description              *string   `json:"description,omitempty"`
	StartStateID             int       `json:"start_state_id"`
	EndStateID               int       `json:"end_state_id"`
	VideoURL                 *string   `json:"video_url,omitempty"`
	EstimatedDurationSeconds int       `json:"estimated_duration_seconds"`
	CreatedAt                time.Time `json:"created_at"`
	UpdatedAt                time.Time `json:"updated_at"`
}

// ToResponse TrickをTrickResponseに変換
func (t *Trick) ToResponse() *TrickResponse {
	return &TrickResponse{
		ID:                       t.ID,
		EquipmentID:              t.EquipmentID,
		CategoryID:               t.CategoryID,
		Name:                     t.Name,
		Description:              t.Description,
		StartStateID:             t.StartStateID,
		EndStateID:               t.EndStateID,
		VideoURL:                 t.VideoURL,
		EstimatedDurationSeconds: t.EstimatedDurationSeconds,
		CreatedAt:                t.CreatedAt,
		UpdatedAt:                t.UpdatedAt,
	}
}

// TrickDetailResponse 技詳細レスポンス（道具名・カテゴリ名・状態名を解決済み）
type TrickDetailResponse struct {
	ID                       int       `json:"id"`
	EquipmentID              int       `json:"equipment_id"`
	EquipmentName            string    `json:"equipment_name"`
	CategoryID               int       `json:"category_id"`
	CategoryName             string    `json:"category_name"`
	Name                     string    `json:"name"`
	Description              *string   `json:"description,omitempty"`
	StartStateID             int       `json:"start_state_id"`
	StartStateName           string    `json:"start_state_name"`
	EndStateID               int       `json:"end_state_id"`
	EndStateName             string    `json:"end_state_name"`
	VideoURL                 *string   `json:"video_url,omitempty"`
	EstimatedDurationSeconds int       `json:"estimated_duration_seconds"`
	CreatedAt                time.Time `json:"created_at"`
	UpdatedAt                time.Time `json:"updated_at"`
}

// TrickSearchFilter 技検索条件
type TrickSearchFilter struct {
	Name        string
	EquipmentID *int
	CategoryID  *int
	StateID     *int // StartStateIDまたはEndStateIDのいずれかに一致
}
