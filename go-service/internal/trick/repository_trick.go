// go-service/internal/trick/repository_trick.go
package trick

import (
	"database/sql"
	"errors"
	"go-service/internal/trick/query"
	"go-service/pkg/database"
	"time"
)

// TrickRepository 技マスタリポジトリのインターフェース
type TrickRepository interface {
	Create(t *Trick) error
	GetByID(id int) (*Trick, error)
	GetAll() ([]*Trick, error)
	Delete(id int) error
}

// MySQLTrickRepository MySQL実装
type MySQLTrickRepository struct {
	db    *database.QueryBuilder
	query *query.TrickQuery
}

// NewMySQLTrickRepository MySQL接続を使用したリポジトリを作成
func NewMySQLTrickRepository(db *database.DB) TrickRepository {
	return &MySQLTrickRepository{
		db:    database.NewQueryBuilder(db),
		query: query.NewTrickQuery(),
	}
}

// Create 技を作成
func (r *MySQLTrickRepository) Create(t *Trick) error {
	now := time.Now()
	result, err := r.db.Exec(
		r.query.Insert(),
		t.EquipmentID, t.CategoryID, t.Name, t.Description,
		t.StartStateID, t.EndStateID, t.VideoURL, t.EstimatedDurationSeconds,
		now, now,
	)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	t.ID = int(id)
	t.IsInvalid = false
	t.CreatedAt = now
	t.UpdatedAt = now
	return nil
}

// GetByID IDで技を取得
func (r *MySQLTrickRepository) GetByID(id int) (*Trick, error) {
	t := &Trick{}
	err := r.db.QueryRow(r.query.SelectByID(), id).Scan(
		&t.ID, &t.EquipmentID, &t.CategoryID, &t.Name, &t.Description,
		&t.StartStateID, &t.EndStateID, &t.VideoURL, &t.EstimatedDurationSeconds,
		&t.IsInvalid, &t.CreatedAt, &t.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, errors.New("trick not found")
	}
	if err != nil {
		return nil, err
	}
	return t, nil
}

// GetAll 全技を取得
func (r *MySQLTrickRepository) GetAll() ([]*Trick, error) {
	rows, err := r.db.Query(r.query.SelectAll())
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tricks := make([]*Trick, 0)
	for rows.Next() {
		t := &Trick{}
		if err := rows.Scan(
			&t.ID, &t.EquipmentID, &t.CategoryID, &t.Name, &t.Description,
			&t.StartStateID, &t.EndStateID, &t.VideoURL, &t.EstimatedDurationSeconds,
			&t.IsInvalid, &t.CreatedAt, &t.UpdatedAt,
		); err != nil {
			return nil, err
		}
		tricks = append(tricks, t)
	}
	return tricks, nil
}

// Delete 技を論理削除
func (r *MySQLTrickRepository) Delete(id int) error {
	result, err := r.db.Exec(r.query.SoftDelete(), time.Now(), id)
	if err != nil {
		return err
	}
	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 0 {
		return errors.New("trick not found")
	}
	return nil
}
