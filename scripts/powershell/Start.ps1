Write-Host "[Bastion]: Checking Bastion system..."
If (Test-Path ".\index.js") {
  Write-Host "[Bastion]: System check successful."
  Write-Host

  Write-Host "[Bastion]: Booting up..."
  Write-Host

  node -r ./utils/globals.js .
}
Else {
  Write-Host "[Bastion]: System check failed."
  Write-Host

  Write-Host "[Bastion]: Check if you have installed Bastion correctly."
  Write-Host "[Bastion]: Follow the installation guide: https://docs.bastionbot.org"
}
Write-Host
