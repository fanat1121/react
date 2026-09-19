// go-service/internal/trick/repository_state.go
package trick

import (
	"database/sql"
	"errors"
	"go-service/internal/trick/query"
	"go-service/pkg/database"
	"time"
)

// StateRepository 状態マスタリポジトリのインターフェース
type StateRepository interface {
	Create(state *State) error
	GetByID(id int) (*State, error)
	GetAll() ([]*State, error)
	Delete(id int) error
}

// MySQLStateRepository MySQL実装
type MySQLStateRepository struct {
	db    *database.QueryBuilder
	query *query.StateQuery
}

// NewMySQLStateRepository MySQL接続を使用したリポジトリを作成
func NewMySQLStateRepository(db *database.DB) StateRepository {
	return &MySQLStateRepository{
		db:    database.NewQueryBuilder(db),
		query: query.NewStateQuery(),
	}
}

// Create 状態を作成
func (r *MySQLStateRepository) Create(state *State) error {
	var count int
	if err := r.db.QueryRow(r.query.CheckNameExists(), state.EquipmentID, state.Name).Scan(&count); err != nil {
		return err
	}
	if count > 0 {
		return errors.New("state name already exists")
	}

	now := time.Now()
	result, err := r.db.Exec(r.query.Insert(), state.EquipmentID, state.Name, state.Description, now, now)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	state.ID = int(id)
	state.IsInvalid = false
	state.CreatedAt = now
	state.UpdatedAt = now
	return nil
}

// GetByID IDで状態を取得
func (r *MySQLStateRepository) GetByID(id int) (*State, error) {
	s := &State{}
	err := r.db.QueryRow(r.query.SelectByID(), id).Scan(&s.ID, &s.EquipmentID, &s.Name, &s.Description, &s.IsInvalid, &s.CreatedAt, &s.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, errors.New("state not found")
	}
	if err != nil {
		return nil, err
	}
	return s, nil
}

// GetAll 全状態を取得
func (r *MySQLStateRepository) GetAll() ([]*State, error) {
	rows, err := r.db.Query(r.query.SelectAll())
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	states := make([]*State, 0)
	for rows.Next() {
		s := &State{}
		if err := rows.Scan(&s.ID, &s.EquipmentID, &s.Name, &s.Description, &s.IsInvalid, &s.CreatedAt, &s.UpdatedAt); err != nil {
			return nil, err
		}
		states = append(states, s)
	}
	return states, nil
}

// Delete 状態を論理削除
func (r *MySQLStateRepository) Delete(id int) error {
	result, err := r.db.Exec(r.query.SoftDelete(), time.Now(), id)
	if err != nil {
		return err
	}
	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 0 {
		return errors.New("state not found")
	}
	return nil
}
