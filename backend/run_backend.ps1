# ProductLife Backend Launcher
# Safely loads DB_PASSWORD from environment or local uncommitted .env file

if (-not $env:JAVA_HOME -or -not (Test-Path "$env:JAVA_HOME\bin\javac.exe")) {
    $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
}

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

.\mvnw.cmd spring-boot:run

