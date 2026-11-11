package trick

import "errors"

// ErrInUse 有効な行（is_invalid = 0）から参照されているため削除できないことを示すエラー
var ErrInUse = errors.New("in use")

// ErrNotFound 対象が存在しない（論理削除済み含む）ことを示すエラー
var ErrNotFound = errors.New("not found")
