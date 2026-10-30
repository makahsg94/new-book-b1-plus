# ============================================================
#  Speakout B1+ Hub — local static server (zero dependencies)
#  بنسخ الملفات الثابتة + دعم Range للصوت والفيديو (seek شغال)
# ============================================================
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$ports = 8123..8140
$listener = $null
$port = $null
foreach($p in $ports){
  try{
    $listener = [System.Net.HttpListener]::new()
    $listener.Prefixes.Add("http://127.0.0.1:$p/")
    $listener.Start()
    $port = $p
    break
  }catch{ $listener = $null }
}
if(-not $listener){
  Write-Host "مفيش بورت فاضي (8123-8140). اقفل البرامج اللي شالها أو جرب تاني." -ForegroundColor Red
  Read-Host "اضغط Enter للخروج"
  exit 1
}

# افتح المتصفح أوتوماتيكي بعد ثانية
Start-Job -ScriptBlock {
  param($p)
  Start-Sleep -Seconds 1
  try{ Start-Process "http://127.0.0.1:$p/" }catch{}
} -ArgumentList $port | Out-Null

Write-Host ""
Write-Host "  (+) Speakout B1+ Hub — شغال" -ForegroundColor Cyan
Write-Host "  (+) العنوان: http://127.0.0.1:$port/" -ForegroundColor Green
Write-Host "  (+) سيب النافذة دي مفتوحة وأنت بتذاكر. اقفلها = الموقع يقفل." -ForegroundColor DarkGray
Write-Host ""

$mimes = @{
  '.html'='text/html; charset=utf-8'; '.htm'='text/html; charset=utf-8'
  '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8'
  '.mjs'='text/javascript; charset=utf-8'; '.json'='application/json; charset=utf-8'
  '.svg'='image/svg+xml'; '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'
  '.webp'='image/webp'; '.ico'='image/x-icon'; '.woff'='font/woff'; '.woff2'='font/woff2'
  '.ttf'='font/ttf'; '.mp3'='audio/mpeg'; '.mp4'='video/mp4'; '.webm'='video/webm'
  '.pdf'='application/pdf'; '.txt'='text/plain; charset=utf-8'; '.md'='text/markdown; charset=utf-8'
  '.map'='application/json'
}

function Send-File($ctx, $path){
  $req = $ctx.Request; $res = $ctx.Response
  $res.Headers['Accept-Ranges'] = 'bytes'
  $res.Headers['Cache-Control'] = 'no-cache'
  $ext = [IO.Path]::GetExtension($path).ToLower()
  if($mimes.ContainsKey($ext)){ $res.ContentType = $mimes[$ext] }
  $fs = [IO.File]::OpenRead($path)
  $len = $fs.Length
  $start = [int64]0; $end = [int64]($len - 1)
  $range = $req.Headers['Range']
  if($range -match 'bytes=(-?\d*)-(-?\d*)'){
    if($Matches[1] -ne ''){ $start = [int64]$Matches[1] }
    if($Matches[2] -ne ''){ $end = [int64]$Matches[2] }
    if($start -gt $end -or $start -ge $len){ $fs.Dispose(); $res.StatusCode = 416; $res.Close(); return }
    $res.StatusCode = 206
    $res.Headers['Content-Range'] = "bytes $start-$end/$len"
  }
  $clen = $end - $start + 1
  $res.ContentLength64 = $clen
  $buf = New-Object byte[] (1MB)
  $fs.Position = $start
  $sent = [int64]0
  try{
    while($sent -lt $clen -and $fs.Position -lt $fs.Length){
      $read = $fs.Read($buf, 0, [Math]::Min($buf.Length, ($clen - $sent)))
      if($read -le 0){ break }
      $res.OutputStream.Write($buf, 0, $read)
      $sent += $read
    }
  }catch{ } # اقطع الاتصال من البراوزر (browse away) عادي
  finally{
    $fs.Dispose()
    try{ $res.OutputStream.Close() }catch{}
  }
}

while($listener.IsListening){
  $ctx = $listener.GetContext()
  try{
    $req = $ctx.Request; $res = $ctx.Response
    $path = [Uri]::UnescapeDataString($req.Url.AbsolutePath)
    $path = $path -replace '\.\.+', '' # امنع الخروج من الفولدر
    if($path -eq '/' -or $path -eq ''){ $path = '/index.html' }
    $file = Join-Path $root ($path -replace '/','\')
    if(Test-Path -LiteralPath $file -PathType Leaf){
      Send-File $ctx $file
    }else{
      $res.StatusCode = 404
      $res.ContentType = 'text/plain; charset=utf-8'
      $bytes = [Text.Encoding]::UTF8.GetBytes("404 — الملف مش موجود: $path")
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      $res.OutputStream.Close()
    }
  }catch{ try{ $ctx.Response.StatusCode = 500; $ctx.Response.Close() }catch{} }
}
