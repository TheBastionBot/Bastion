#!/bin/bash

if [[ "${BASH_SOURCE[0]}" == "$0" ]]
then
  exit 1
fi


function private::bastion_screen_name () {
  screen -ls | grep "\\.${NAME//./\\.}"
}


function method::debug () {
  if [[ $(private::bastion_screen_name) ]]
  then
    print::error "$NAME is already running!"
    print::info "Stop Bastion before you run it in dubug mode!"
  else
    npm start
  fi
}

function method::fix-dependencies () {
  print::message "Fixing dependencies..."
  rm -rf node_modules package-lock.json
  npm install --no-package-lock
}

function method::fix-locales () {
  print::message "Fixing locales..."
  export LC_ALL="$LANG"
  grep -qF "LC_ALL=\"$LANG\"" /etc/environment || echo "LC_ALL=\"$LANG\"" | sudo tee -a /etc/environment 1>/dev/null
}

function method::help () {
  echo
  echo -e "${CYAN}Bastion${NC} - One of the best Discord Bot!"
  echo -e "Give awesome perks to your Discord Server!"
  echo
  echo -e "${GREEN}Usage:${NC}"
  echo " $0 --[OPTION]"
  echo
  echo -e "${GREEN}Options:${NC}"
  echo " --debug      Start Bastion in debug mode to see the issue that is"
  echo "              preventing Bastion from booting. Does not start Bastion in"
  echo "              background, so if you close the debug mode, Bastion stops."
  echo " --fix-d      Fixes dependencies issues by reinstalling dependencies."
  echo " --fix-l      Fixes locales issue that causes errors with youtube-dl."
  echo " --restart    Restarts Bastion."
  echo " --show       Shows you real-time log of Bastion running in background."
  echo " --start      Starts Bastion in background - in a screen session -"
  echo "              which will keep running even if you close the terminal."
  echo " --status     Shows you if Bastion is running in the background or not."
  echo " --stop       Stops Bastion's process that is running in the background."
  echo " --update     Updates Bastion to the latest version without losing data."
  echo
  echo -e "${GREEN}Examples:${NC}"
  echo " $0 --start"
  echo " $0 --stop"
  echo " $0 --update"
  echo
}

function method::show () {
  if [[ $(private::bastion_screen_name) ]]
  then
    tail -f screenlog.0
  else
    print::info "$NAME is currently ${RED}stopped${NC}!"
  fi
}

function method::start () {
  if [[ $(private::bastion_screen_name) ]]
  then
    print::info "$NAME is already started."
  else
    print::message "Checking Bastion System..."
    if [ -r index.js ]
    then
      print::message "System check successful."
      echo

      print::message "Booting up..."

      screen -L -dmS "$NAME" /bin/bash -c "until npm start .; do sleep 1; done"

      print::info "$NAME was successfully started!"
    else
      print::error "System check failed."
      echo

      print::message "Check if you have installed Bastion correctly."
      print::message "Follow the installation guide: https://bastion.gitbook.io"
    fi
  fi
}

function method::status () {
  if [[ $(private::bastion_screen_name) ]]
  then
    print::info "$NAME is currently ${GREEN}running${NC}!"
  else
    print::info "$NAME is currently ${RED}stopped${NC}!"
  fi
}

function method::stop () {
  if [[ $(private::bastion_screen_name) ]]
  then
    kill "$(private::bastion_screen_name | awk -F . '{print $1}' | awk '{print $1}')"
    print::info "$NAME was successfully ${RED}stopped!"
  else
    print::info "$NAME is currently ${RED}stopped${NC}!"
  fi
}

# shellcheck disable=SC2181
function method::update () {
  if [[ $(private::bastion_screen_name) ]]
  then
    print::error "$NAME is currently running."
    print::info "Stop Bastion before running the update."
  else
    print::message "Updating..."

    git pull
    if ! [[ "$?" -eq 0 ]]
    then
      print::error "Failed to download files for updating."
      print::message "Contact Bastion Support for help."
      return 1
    fi

    echo "Updating dependencies..."

    rm -fr node_modules package-lock.json screenlog.0
    npm install --no-package-lock
    if ! [[ "$?" -eq 0 ]]
    then
      print::error "Failed to install dependencies."
      print::message "Contact Bastion Support for help."
      exit 1
    fi

    echo "Preparing..."

    npm run transpile
    if ! [[ "$?" -eq 0 ]]
    then
      print::error "Found some errors while building Bastion."
      print::message "Contact Bastion Support for help."
      exit 1
    fi

    print::message "Ready to boot up and start running."
  fi
}
