Function Pass-Step {
  Write-Host
  Write-Host "[Bastion]: Done."
  Write-Host
}

Function Exit-Bastion-Updater {
  Write-Host
  Write-Host "[Bastion]: Get Help/Support in Bastion HQ: https://discord.gg/fzx8fkt"
  Write-Host

  Exit-PSSession
}


# Check if Bastion is installed correctly
Write-Host "[Bastion]: Checking Bastion system..."
If (-Not (Test-Path ".git")) {
  Write-Host "[Bastion]: System check failed."
  Write-Host

  Write-Host "[Bastion]: Check if you have installed Bastion correctly."
  Write-Host "[Bastion]: Follow the installation guide: https://docs.bastionbot.org"

  Exit-Bastion-Updater
}
Write-Host "[Bastion]: System check successful."
Write-Host


# Pull new changes to Bastion from GitHub
Write-Host "[Bastion]: Updating Bastion..."
Write-Host

git pull
If (-Not ($?)) {
  Write-Host "[Bastion]: Unable to update Bastion, error while updating Bastion."
  Write-Host "[Bastion]: Contact Bastion Support for help."
  Write-Host

  Exit-Bastion-Updater
}

Pass-Step


# Update global FFmpeg binaries
Write-Host "[Bastion]: Updating FFmpeg..."
Write-Host

choco upgrade ffmpeg -y
If (-Not ($?)) {
  Write-Host "[Bastion]: Unable to update Bastion, error while updating FFmpeg."
  Write-Host "[Bastion]: Try updating it manually: choco upgrade ffmpeg -y"
  Write-Host "[Bastion]: Contact Bastion Support for further help."

  Exit-Bastion-Updater
}

Pass-Step


# Update Bastion dependencies
Write-Host "[Bastion]: Updating dependencies..."
Write-Host

Remove-Item -Path ".\node_modules", ".\package-lock.json" -Force -Recurse -ErrorAction SilentlyContinue
yarn install --production --no-lockfile
If (-Not ($?)) {
  Write-Host "[Bastion]: Unable to update Bastion, error while updating dependencies."
  Write-Host "[Bastion]: Try updating it manually: yarn install --production --no-lockfile"
  Write-Host "[Bastion]: Contact Bastion Support for further help."

  Exit-Bastion-Updater
}

Pass-Step


# Update was successful
Write-Host "[Bastion]: Bastion was successfully updated."
Write-Host

Write-Host "[Bastion]: Ready to boot up and start running!"

Exit-Bastion-Updater
