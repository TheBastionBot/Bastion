#!/bin/bash

if [[ "${BASH_SOURCE[0]}" == "$0" ]]
then
  exit 1
fi


print::message "Hello, $USER!"
echo
