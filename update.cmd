@ECHO off
TITLE Bastion BOT
CLS
COLOR 0F
ECHO.

SET cwd=%~dp0

IF EXIST node_modules (
  ECHO [Bastion]: Deleting old dependencies...
  RD /S /Q node_modules
  ECHO [Bastion]: Done.
)
ECHO [Bastion]: Installing new dependencies...
npm install &>nul
npm install -g ffmpeg-binaries &>nul
ECHO [Bastion]: Done.
ECHO [Bastion]: Ready to boot up and start running.
ECHO.

EXIT /B 0

:EXIT
ECHO.
ECHO [Bastion]: Press any key to exit.
PAUSE &>nul
CD /D "%cwd%"
TITLE Windows Command Prompt (CMD)
COLOR
