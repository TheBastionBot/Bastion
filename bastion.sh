#!/bin/bash

NAME="BastionBot";
NC='\033[0m';
RED='\033[0;31m';
ORANGE='\033[0;33m'
GREEN='\033[0;32m';
CYAN='\033[0;36m';

if ! [ -z "$SUDO_USER" ]; then
  echo -e "${CYAN}[Bastion]: ${RED}[ERROR] I do not need root permissions.${NC} Please run without sudo."
  exit 1
fi

command -v screen >/dev/null 2>&1
if [ $? -ne 0 ]; then
	echo -e "${CYAN}[Bastion]: ${ORANGE}You need to install 'screen' if you want to use this script!${NC}"
	exit 1
fi

function screengrepname () {
	screen -ls | grep "\\.${NAME//./\\.}	"
}

case $1 in

debug)
	if [[ $(screengrepname) ]]; then
		echo -e "${ORANGE}$NAME is already running.${NC} Use '$0 stop' to stop it before you run it in dubug mode!"
	else
		node .
	fi
;;

restart)
	$0 stop
	$0 start
;;

show)
	tail -f screenlog.0
;;

start)
	# Remove screen log before starting it again
	if [[ $(screengrepname) ]]; then
		echo -e "${ORANGE}$NAME is already started.${NC} Use '$0 stop' to stop or '$0 restart' to restart it."
	else
    echo -e "${CYAN}[Bastion]:${NC} Checking System..."
    if [ -r bastion.js ]; then
      echo -e "${CYAN}[Bastion]:${NC} System Checked. O7" && echo -e "${CYAN}[Bastion]:${NC} Booting up..."
      screen -dmS "$NAME" -L /bin/bash -c "until node .; do sleep 1; done"
      echo -e "${GREEN}$NAME was successfully started!${NC} If you have any problems, see the log using '$0 show' or start $NAME in dubug mode using '$0 debug'!"
    else
      echo -e "${CYAN}[Bastion]: ${RED}[ERROR] System Check Failed." && echo -e "${CYAN}[Bastion]: ${NC}Check if you have Bastion Bot installed correctly." && exit 1
    fi
	fi
;;

status)
	if [[ $(screengrepname) ]]; then
		echo -e "$NAME is currently ${GREEN}running${NC}!"
	else
		echo -e "$NAME is currently ${RED}stopped${NC}!"
	fi
;;

stop)
	if [[ $(screengrepname) ]]; then
		kill "$(screengrepname | awk -F . '{print $1}' | awk '{print $1}')"
		echo -e "$NAME was successfully ${RED}stopped!"
	else
		echo "$NAME is not running!"
	fi
;;

update)
	if [[ $(screengrepname) ]]; then
		echo -e "${ORANGE}$NAME is currently running.${NC} Use '$0 stop' to stop it before running the update."
	else
		echo "Updating $NAME..."
		git pull origin master 1>/dev/null || (echo -e "${CYAN}[Bastion]: ${RED} Unable to download update files. Please check your internet connection.\n" && exit 1)
		echo "Updating dependencies..."
		npm install --production 1>/dev/null 2>update.log || (echo -e "${CYAN}[Bastion]: ${RED} Failed installing dependencies. Please see update.log file and report it, if it's really an issue.\n" && exit 1)
		echo "Deleting unused dependencies..."
		npm prune 1>/dev/null 2>update.log
		echo -e "${CYAN}[Bastion]:${NC} Ready to boot up and start running."
	fi
;;

upgrade)
	if [[ $(screengrepname) ]]; then
		echo -e "${ORANGE}$NAME is currently running.${NC} Use '$0 stop' to stop it before running the update."
	else
		echo "Deleting old files..."
		rm -fr node_modules
		rm -f data/Bastion.sqlite
		echo "Updating $NAME..."
		git pull origin master 1>/dev/null || (echo -e "${CYAN}[Bastion]: ${RED} Unable to download update files. Please check your internet connection.\n" && exit 1)
		echo "Updating dependencies..."
		npm install --production 1>/dev/null 2>update.log || (echo -e "${CYAN}[Bastion]: ${RED} Failed installing dependencies. Please see update.log file and report it, if it's really an issue.\n" && exit 1)
		echo -e "${CYAN}[Bastion]:${NC} Ready to boot up and start running."
	fi
;;

fix)
  echo -e "${CYAN}[Bastion]:${NC} Fixing locales..."
  export LC_ALL="$LANG"
  grep -qF "LC_ALL=\"$LANG\"" /etc/environment || echo "LC_ALL=\"$LANG\"" | sudo tee -a /etc/environment 1>/dev/null
  echo -e "${CYAN}[Bastion]:${NC} Fixing permissions..."
  (
    cd .. && sudo chown -R "$USER":"$(id -gn "$USER")" Bastion .config
  )
;;

*)
	echo -e "${ORANGE}Usage:${NC} $0 [start|stop|restart|debug|status|show|update|upgrade|fix]"
;;

esac
