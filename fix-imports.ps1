# Fix all @version suffixes in imports

$packages = @(
    '@radix-ui/react-accordion',
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-avatar',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-collapsible',
    '@radix-ui/react-context-menu',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-hover-card',
    '@radix-ui/react-label',
    '@radix-ui/react-menubar',
    '@radix-ui/react-navigation-menu',
    '@radix-ui/react-popover',
    '@radix-ui/react-progress',
    '@radix-ui/react-radio-group',
    '@radix-ui/react-scroll-area',
    '@radix-ui/react-select',
    '@radix-ui/react-separator',
    '@radix-ui/react-slider',
    '@radix-ui/react-slot',
    '@radix-ui/react-switch',
    '@radix-ui/react-tabs',
    '@radix-ui/react-toggle',
    '@radix-ui/react-toggle-group',
    '@radix-ui/react-tooltip'
)

Get-ChildItem -Recurse -Include "*.tsx", "*.ts" -Path "src" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $modified = $false
    
    foreach ($pkg in $packages) {
        $pattern = [regex]::Escape($pkg) + '@[\d\.]+'
        if ($content -match $pattern) {
            $content = $content -replace $pattern, $pkg
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $_.FullName -Value $content -Encoding UTF8
        Write-Host "✓ Fixed: $($_.Name)"
    }
}

Write-Host "`n✓ All @version imports removed"
