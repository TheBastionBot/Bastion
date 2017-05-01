#!/bin/bash
set -e

reset

NC='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'

if [ "$(id -u)" != "0" ]; then
  echo -e "${CYAN}[Bastion]: ${ORANGE}[ERROR] Bastion BOT Installer requires root permissions.${NC}"
  hash sudo &>/dev/null || (echo -e "${CYAN}[Bastion]: ${NC} Run this installer with root permissions.\n" && exit 1)
  sudo ./run.sh
  exit 1
fi

echo -e "${CYAN}[Bastion]:${NC} Checking System..."
echo

if [ -r bastion.js ]; then
    echo -e "${CYAN}[Bastion]:${NC} System Checked. O7" && echo -e "${CYAN}[Bastion]:${NC} Booting up..."
    nohup node bastion.js > bastion.log 2>&1 &
    echo $! > bastion.pid
    echo -e "${CYAN}[Bastion]:${NC} I've booted up [with ${GREEN}PID ${!}${NC}], and ready to roll."
else
    echo -e "${CYAN}[Bastion]: ${RED}[ERROR] System Check Failed." && echo -e "${CYAN}[Bastion]: ${NC}Check if you have Bastion BOT installed correctly." && exit 1
fi
echo
