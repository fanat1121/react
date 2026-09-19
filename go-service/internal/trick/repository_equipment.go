package trick

import (
	"database/sql"
	"errors"
	"go-service/internal/trick/query"
	"go-service/pkg/database"
	"time"
)

// EquipmentRepository 道具マスタリポジトリのインターフェース
type EquipmentRepository interface {
	Create(equipment *Equipment) error
	GetByID(id int) (*Equipment, error)
	GetAll() ([]*Equipment, error)
	Delete(id int) error
}

// MySQLEquipmentRepository MySQL実装
type MySQLEquipmentRepository struct {
	db    *database.QueryBuilder
	query *query.EquipmentQuery
}

// NewMySQLEquipmentRepository MySQL接続を使用したリポジトリを作成
func NewMySQLEquipmentRepository(db *database.DB) EquipmentRepository {
	return &MySQLEquipmentRepository{
		db:    database.NewQueryBuilder(db),
		query: query.NewEquipmentQuery(),
	}
}

// Create 道具を作成
func (r *MySQLEquipmentRepository) Create(equipment *Equipment) error {
	var count int
	if err := r.db.QueryRow(r.query.CheckNameExists(), equipment.Name).Scan(&count); err != nil {
		return err
	}
	if count > 0 {
		return errors.New("equipment name already exists")
	}

	now := time.Now()
	result, err := r.db.Exec(r.query.Insert(), equipment.Name, now, now)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	equipment.ID = int(id)
	equipment.IsInvalid = false
	equipment.CreatedAt = now
	equipment.UpdatedAt = now
	return nil
}

// GetByID IDで道具を取得
func (r *MySQLEquipmentRepository) GetByID(id int) (*Equipment, error) {
	e := &Equipment{}
	err := r.db.QueryRow(r.query.SelectByID(), id).Scan(&e.ID, &e.Name, &e.IsInvalid, &e.CreatedAt, &e.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, errors.New("equipment not found")
	}
	if err != nil {
		return nil, err
	}
	return e, nil
}

// GetAll 全道具を取得
func (r *MySQLEquipmentRepository) GetAll() ([]*Equipment, error) {
	rows, err := r.db.Query(r.query.SelectAll())
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	equipments := make([]*Equipment, 0)
	for rows.Next() {
		e := &Equipment{}
		if err := rows.Scan(&e.ID, &e.Name, &e.IsInvalid, &e.CreatedAt, &e.UpdatedAt); err != nil {
			return nil, err
		}
		equipments = append(equipments, e)
	}
	return equipments, nil
}

// Delete 道具を論理削除
func (r *MySQLEquipmentRepository) Delete(id int) error {
	result, err := r.db.Exec(r.query.SoftDelete(), time.Now(), id)
	if err != nil {
		return err
	}
	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 0 {
		return errors.New("equipment not found")
	}
	return nil
}
