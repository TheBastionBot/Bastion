#!/bin/bash

if [[ "${BASH_SOURCE[0]}" == "$0" ]]
then
  exit 1
fi


if ! hash screen &>/dev/null
then
  print::error "'screen' was not found in your system"
  print::message "You need to install 'screen' if you want to run Bastion."
  echo

  exit 1
fi

if ! hash node &>/dev/null
then
  print::error "Node.js was not found in your system"
  print::message "You need to install Node.js if you want to run Bastion."
  echo

  exit 1
elif ! [ "$(node --version | cut -d'v' -f 2 | cut -d'.' -f 1)" -ge 18 ]
then
  print::error "Found an outdated version of Node.js"
  print::message "Node.js version 18.x or higher is required to run Bastion."
fi
