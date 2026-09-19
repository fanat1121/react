package trick

import (
	"database/sql"
	"errors"
	"go-service/internal/trick/query"
	"go-service/pkg/database"
	"time"
)

// EquipmentCategoryRepository 道具カテゴリマスタリポジトリのインターフェース
type EquipmentCategoryRepository interface {
	Create(category *EquipmentCategory) error
	GetByID(id int) (*EquipmentCategory, error)
	GetAll() ([]*EquipmentCategory, error)
	Delete(id int) error
}

// MySQLEquipmentCategoryRepository MySQL実装
type MySQLEquipmentCategoryRepository struct {
	db    *database.QueryBuilder
	query *query.CategoryQuery
}

// NewMySQLEquipmentCategoryRepository MySQL接続を使用したリポジトリを作成
func NewMySQLEquipmentCategoryRepository(db *database.DB) EquipmentCategoryRepository {
	return &MySQLEquipmentCategoryRepository{
		db:    database.NewQueryBuilder(db),
		query: query.NewCategoryQuery(),
	}
}

// Create カテゴリを作成
func (r *MySQLEquipmentCategoryRepository) Create(category *EquipmentCategory) error {
	var count int
	if err := r.db.QueryRow(r.query.CheckNameExists(), category.EquipmentID, category.Name).Scan(&count); err != nil {
		return err
	}
	if count > 0 {
		return errors.New("equipment category name already exists")
	}

	now := time.Now()
	result, err := r.db.Exec(r.query.Insert(), category.EquipmentID, category.Name, now, now)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	category.ID = int(id)
	category.IsInvalid = false
	category.CreatedAt = now
	category.UpdatedAt = now
	return nil
}

// GetByID IDでカテゴリを取得
func (r *MySQLEquipmentCategoryRepository) GetByID(id int) (*EquipmentCategory, error) {
	c := &EquipmentCategory{}
	err := r.db.QueryRow(r.query.SelectByID(), id).Scan(&c.ID, &c.EquipmentID, &c.Name, &c.IsInvalid, &c.CreatedAt, &c.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, errors.New("equipment category not found")
	}
	if err != nil {
		return nil, err
	}
	return c, nil
}

// GetAll 全カテゴリを取得
func (r *MySQLEquipmentCategoryRepository) GetAll() ([]*EquipmentCategory, error) {
	rows, err := r.db.Query(r.query.SelectAll())
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	categories := make([]*EquipmentCategory, 0)
	for rows.Next() {
		c := &EquipmentCategory{}
		if err := rows.Scan(&c.ID, &c.EquipmentID, &c.Name, &c.IsInvalid, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, err
		}
		categories = append(categories, c)
	}
	return categories, nil
}

// Delete カテゴリを論理削除
func (r *MySQLEquipmentCategoryRepository) Delete(id int) error {
	result, err := r.db.Exec(r.query.SoftDelete(), time.Now(), id)
	if err != nil {
		return err
	}
	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 0 {
		return errors.New("equipment category not found")
	}
	return nil
}
