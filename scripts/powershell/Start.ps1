Write-Host "[Bastion]: Checking Bastion system..."
If (Test-Path ".\index.js") {
  Write-Host "[Bastion]: System check successful."
  Write-Host

  Write-Host "[Bastion]: Booting up..."
  Write-Host

  npm start
}
Else {
  Write-Host "[Bastion]: System check failed."
  Write-Host

  Write-Host "[Bastion]: Check if you have installed Bastion correctly."
  Write-Host "[Bastion]: You can get help at Bastion HQ: https://discord.gg/fzx8fkt"
}
Write-Host
