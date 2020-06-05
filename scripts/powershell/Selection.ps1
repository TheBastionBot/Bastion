$caption = "[BASTION]: Hello, $env:UserName!
 "
$description = "[BASTION]: Select the option you would like to perform.
 "

$choices = New-Object Collections.ObjectModel.Collection[Management.Automation.Host.ChoiceDescription]
$choices.Add((
  New-Object Management.Automation.Host.ChoiceDescription `
    -ArgumentList `
      "&Start Bastion",
      "Start Bastion and keep it running until you close the terminal."
))
$choices.Add((
  New-Object Management.Automation.Host.ChoiceDescription `
    -ArgumentList `
      "&Update Bastion",
      "Update Bastion to the latest available version."
))
$choices.Add((
  New-Object Management.Automation.Host.ChoiceDescription `
    -ArgumentList `
      "&Exit",
      "Exit this script.
      "
))

$selection = $host.ui.PromptForChoice($caption, $description, $choices, -1)
Write-Host

switch($selection) {
  0 {
    .\scripts\powershell\Start.ps1
  }
  1 {
    .\scripts\powershell\Update.ps1
  }
  2 {
    Exit
  }
}
