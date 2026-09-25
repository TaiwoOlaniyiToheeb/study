$vercelUrl = "https://study-gray-psi.vercel.app"   # <-- replace with your real Vercel URL, no trailing slash
$backend = "https://ai-study-schedule-api.onrender.com"

$endpoints = @(
  "/api/study-availability",
  "/api/study-preferences",
  "/api/study-schedule/generate"
)

foreach ($ep in $endpoints) {
  Write-Host "`n=== OPTIONS $ep ===" -ForegroundColor Cyan
  curl.exe -s -i -X OPTIONS "$backend$ep" `
    -H "Origin: $vercelUrl" `
    -H "Access-Control-Request-Method: POST" `
    -H "Access-Control-Request-Headers: authorization,content-type" | Select-String "HTTP|access-control"
}
