#!/bin/bash

HEADER="User-Agent: BastionScripts (Bastion; https://bastion.traction.one)"

wget --header="$HEADER" -O ./assets/badges.json https://omnic.traction.one/badges
