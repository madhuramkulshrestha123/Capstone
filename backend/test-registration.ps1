# Test User Registration Flow

# Step 1: Send OTP for registration
Write-Host "Step 1: Sending OTP for registration..." -ForegroundColor Green

$body = @{
    email = "test@example.com"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/users/register/send-otp" -Method POST -ContentType "application/json" -Body $body
    $content = $response.Content | ConvertFrom-Json
    Write-Host "Response: $($response.StatusCode)" -ForegroundColor Cyan
    Write-Host "Content: $($content | ConvertTo-Json -Depth 10)" -ForegroundColor Yellow
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $responseStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($responseStream)
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}