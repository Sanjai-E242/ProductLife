# ProductLife Backend Launcher
# Safely loads DB_PASSWORD from environment or local uncommitted .env file

if (Test-Path "$PSScriptRoot\.env") {
    Get-Content "$PSScriptRoot\.env" | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith('#') -and $line.Contains('=')) {
            $parts = $line.Split('=', 2)
            $varName = $parts[0].Trim()
            $varValue = $parts[1].Trim()
            [System.Environment]::SetEnvironmentVariable($varName, $varValue, "Process")
        }
    }
}

if (-not $env:DB_PASSWORD) {
    Write-Warning "DB_PASSWORD environment variable is not set. Spring Boot will attempt connecting with blank password."
}

if (-not $env:ADMIN_PASSWORD) {
    Write-Warning "ADMIN_PASSWORD environment variable is not set. Administrator login endpoints will fail safely."
}

.\mvnw.cmd spring-boot:run
