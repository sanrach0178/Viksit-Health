$uiFiles = Get-ChildItem -Recurse -Filter "*.tsx" -Path "src\components\ui"

foreach ($file in $uiFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Remove all @version suffixes from @radix-ui imports
    $fixed = $content -replace '(@radix-ui/[^"]*?)@[\d\.]+', '$1'
    
    if ($content -ne $fixed) {
        Set-Content -Path $file.FullName -Value $fixed
        Write-Host "✓ Fixed: $($file.Name)"
    }
}

Write-Host "`n✓ All @version imports removed from src/components/ui/"
