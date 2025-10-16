package database

import (
	"database/sql"
)

// Executor DBクエリ実行の共通インターフェース
type Executor interface {
	Exec(query string, args ...interface{}) (sql.Result, error)
	Query(query string, args ...interface{}) (*sql.Rows, error)
	QueryRow(query string, args ...interface{}) *sql.Row
}

// DB sql.DBのラッパー
type DB struct {
	*sql.DB
}

// NewDB DBラッパーを作成
func NewDB(db *sql.DB) *DB {
	return &DB{db}
}

// Transaction トランザクション実行
func (db *DB) Transaction(fn func(*sql.Tx) error) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	defer func() {
		if p := recover(); p != nil {
			tx.Rollback()
			panic(p)
		} else if err != nil {
			tx.Rollback()
		} else {
			err = tx.Commit()
		}
	}()

	err = fn(tx)
	return err
}

// QueryBuilder クエリビルダーヘルパー
type QueryBuilder struct {
	executor Executor
}

// NewQueryBuilder クエリビルダーを作成
func NewQueryBuilder(executor Executor) *QueryBuilder {
	return &QueryBuilder{executor: executor}
}

// Exec クエリ実行
func (qb *QueryBuilder) Exec(query string, args ...interface{}) (sql.Result, error) {
	return qb.executor.Exec(query, args...)
}

// QueryRow 単一行取得
func (qb *QueryBuilder) QueryRow(query string, args ...interface{}) *sql.Row {
	return qb.executor.QueryRow(query, args...)
}

// Query 複数行取得
func (qb *QueryBuilder) Query(query string, args ...interface{}) (*sql.Rows, error) {
	return qb.executor.Query(query, args...)
}
