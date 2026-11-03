package trick

import "errors"

// ErrInUse 有効な行（is_invalid = 0）から参照されているため削除できないことを示すエラー
var ErrInUse = errors.New("in use")
