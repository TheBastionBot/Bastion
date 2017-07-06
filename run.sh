#!/bin/bash
set -e

reset

NC='\033[0m'
RED='\033[0;31m'
CYAN='\033[0;36m'

# If running with sudo, exit
if ! [ -z "$SUDO_USER" ]; then
  echo -e "${CYAN}[Bastion]: ${RED}[ERROR] I do not need root permissions.${NC} Please run without sudo."
  exit 1
fi

# Set locale (needed to stop music warnings)
export LC_ALL="$LANG"
echo "LC_ALL=\"$LANG\"" >> sudo /etc/environment

# Check if bastion.js exists, run Bastion if true or exit
echo -e "${CYAN}[Bastion]:${NC} Checking System..."
if [ -r bastion.js ]; then
  echo -e "${CYAN}[Bastion]:${NC} System Checked. O7" && echo -e "${CYAN}[Bastion]:${NC} Booting up..."
  screen -dmS BastionBot -L node .
  echo $! > bastion.pid
  echo -e "${CYAN}[Bastion]:${NC} I've booted up, and ready to roll."
else
  echo -e "${CYAN}[Bastion]: ${RED}[ERROR] System Check Failed." && echo -e "${CYAN}[Bastion]: ${NC}Check if you have Bastion Bot installed correctly." && exit 1
fi
echo
