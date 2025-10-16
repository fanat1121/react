package validator

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func init() {
	validate = validator.New()
	// JSONタグをフィールド名として使用
	validate.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})
}

// Validate 構造体をバリデーション
func Validate(data interface{}) error {
	if err := validate.Struct(data); err != nil {
		// エラーメッセージを整形
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			var messages []string
			for _, e := range validationErrors {
				messages = append(messages, formatError(e))
			}
			return fmt.Errorf(strings.Join(messages, ", "))
		}
		return err
	}
	return nil
}

// formatError バリデーションエラーを人間が読める形式に変換
func formatError(e validator.FieldError) string {
	field := e.Field() // JSONタグ名をそのまま使用

	switch e.Tag() {
	case "required":
		return fmt.Sprintf("%s is required", field)
	case "email":
		return fmt.Sprintf("%s must be a valid email", field)
	case "min":
		return fmt.Sprintf("%s must be at least %s characters", field, e.Param())
	case "max":
		return fmt.Sprintf("%s must be at most %s characters", field, e.Param())
	case "alphanum":
		return fmt.Sprintf("%s must contain only alphanumeric characters", field)
	case "gte":
		return fmt.Sprintf("%s must be greater than or equal to %s", field, e.Param())
	case "lte":
		return fmt.Sprintf("%s must be less than or equal to %s", field, e.Param())
	case "gt":
		return fmt.Sprintf("%s must be greater than %s", field, e.Param())
	case "lt":
		return fmt.Sprintf("%s must be less than %s", field, e.Param())
	default:
		return fmt.Sprintf("%s is invalid", field)
	}
}
