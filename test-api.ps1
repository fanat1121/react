# ユーザー登録テスト
$body = @{
    username = "sakura_chan"
    email = "sakura@example.com"
    password = "secret123"
} | ConvertTo-Json

Write-Host "=== ユーザー登録 ===" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/users" -Method POST -ContentType "application/json" -Body $body
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "エラー: $_" -ForegroundColor Red
}

Write-Host "`n=== 全ユーザー取得 ===" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/users" -Method GET
$response | ConvertTo-Json -Depth 10
