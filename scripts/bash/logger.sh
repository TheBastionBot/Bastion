#!/bin/bash

function print-message () {
  echo -e "${CYAN}[BASTION]:${NC} $@"
}

function print-info () {
  echo -e "${GREEN}[   INFO]:${NC} $@"
}

function print-warn () {
  echo -e "${ORANGE}[WARNING]:${NC} $@"
}

function print-error () {
  echo -e "${RED}[  ERROR]:${NC} $@"
}
