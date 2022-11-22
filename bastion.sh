#!/bin/bash

cd "$(dirname "$0")" || cd . || (echo "This script should be run where Bastion is located." && exit 1)


echo
source ./scripts/bash/definitions.sh
source ./scripts/bash/logger.sh

if [ -n "$SUDO_USER" ]
then
  echo
  print::error "Root permission detected"
  print::message "I do not need root permissions. Please run without using sudo."
  echo

  exit 1
fi

source ./scripts/bash/welcome.sh
source ./scripts/bash/checks.sh
source ./scripts/bash/methods.sh


case $1 in

--debug)
  method::debug
;;

--restart)
  method::stop
  method::start
;;

--show)
  method::show
;;

--start)
  method::start
;;

--status)
  method::status
;;

--stop)
  method::stop
;;

--update)
  method::update
;;

*)
  method::help
;;

esac

echo
print::message "You can get help at Bastion HQ: https://discord.gg/fzx8fkt"
print::message "Join Bastion HQ and stay updated on important announcements, releases, giveaways, etc."
echo

# EOF
