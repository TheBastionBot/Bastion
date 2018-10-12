$caption = "[Bastion]: Are you sure you want to reset Bastion?"
$description = "[Bastion]: Resetting Bastion will remove ALL the saved data.
 "

$choices = New-Object Collections.ObjectModel.Collection[Management.Automation.Host.ChoiceDescription]
$choices.Add((
  New-Object Management.Automation.Host.ChoiceDescription `
    -ArgumentList `
      "&Yes",
      "Yes, I'm sure I want to reset all the saved data of Bastion."
))
$choices.Add((
  New-Object Management.Automation.Host.ChoiceDescription `
    -ArgumentList `
      "&No",
      "No, I don't want to delete the saved data.
      "
))

$decision = $Host.UI.PromptForChoice($caption, $description, $choices, 1)
Write-Host

If ($decision -eq 0) {
  Write-Host "[Bastion]: Resetting Bastion..."
  Remove-Item -Path ".\data\bastion.db" -Force -Recurse -ErrorAction SilentlyContinue
  Write-Host "[Bastion]: Done."
  Write-Host

  Write-Host "[Bastion]: All the saved data was removed from Bastion."
}
Else {
  Write-Host "[Bastion]: The operation was cancelled."
  Write-Host "[Bastion]: None of your data was removed."
}


Write-Host
Write-Host "[Bastion]: Get Help/Support in Bastion HQ: https://discord.gg/fzx8fkt"
Write-Host
