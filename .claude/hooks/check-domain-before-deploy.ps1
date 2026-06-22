# PreToolUse hook: warn before a real deploy if the placeholder domain
# "eec.example" is still present in the web/ project.
# Returns permissionDecision "ask" (a reminder the user can override) when a
# deploy-like command is detected AND the placeholder domain still exists.

$ErrorActionPreference = 'Stop'
try {
  $raw = [Console]::In.ReadToEnd()
  $payload = $raw | ConvertFrom-Json
  $cmd = [string]$payload.tool_input.command
} catch {
  exit 0  # can't parse → don't interfere
}

if ([string]::IsNullOrWhiteSpace($cmd)) { exit 0 }

# Deploy-like command patterns (real publish, not local build/dev)
$deployPattern = 'vercel(\s|$)|--prod\b|netlify\s+deploy|firebase\s+deploy|wrangler\s+(deploy|pages)|gh-pages|surge\b|(npm|pnpm|yarn)\s+run\s+deploy|git\s+push.*(prod|main|master|release)'
if ($cmd -notmatch $deployPattern) { exit 0 }

# Check whether the placeholder domain is still in the codebase
$webDir = 'C:\Users\TANG\Desktop\EECWebPage\web\app'
$hit = $null
if (Test-Path $webDir) {
  try {
    $hit = Get-ChildItem -Path $webDir -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx -ErrorAction SilentlyContinue |
           Select-String -Pattern 'eec\.example' -List -ErrorAction SilentlyContinue | Select-Object -First 1
  } catch { $hit = $null }
}

if ($null -eq $hit) { exit 0 }  # domain already changed → allow silently

$reason = "DEPLOY GUARD: placeholder domain 'https://eec.example' is still in the code (layout.tsx, sitemap.ts, robots.ts). Set the REAL domain first, or canonical/OG/sitemap will be wrong. Confirm only if this deploy is intentional with the placeholder."
$out = @{
  hookSpecificOutput = @{
    hookEventName = 'PreToolUse'
    permissionDecision = 'ask'
    permissionDecisionReason = $reason
  }
} | ConvertTo-Json -Depth 5
Write-Output $out
exit 0
