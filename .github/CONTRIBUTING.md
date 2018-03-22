# The Bastion Bot Contributing Guidelines

## Table of Contents
* Introduction
* Roles
  * [Community Members]
  * [The Bastion Bot Team]

## Introduction
Welcome to the Bastion Bot Contributor Guide! This document outlines the
[TheBastionBot/Bastion] repository's process for community interaction and
contribution. This includes the issue tracker, pull requests, and, to a certain
extent, outside communication in the context of the Bastion Bot. It defines
roles, responsibilities, and procedures, and is an entry point for anyone
wishing to contribute their time and effort to making Bastion a better bot for
the Discord community!

All interactions in the [TheBastionBot/Bastion] repository are covered by our
[Code of Conduct].

## Roles
There are two main roles for people participating in this community. Each has a
specific set of abilities and responsibilities: [Community members] and
[the Bastion bot team].

Failing to comply with the expected responsibilities of each role, or violating
the [Code of Conduct] will result in punitive action relative to the
transgression, ranging from a warning to full removal from the project, at the
discretion of [the Bastion bot team].

### Community Members
This includes anyone who may show up to the [TheBastionBot/Bastion] repository
with issues, PRs, comments etc. They may not have any other involvement with
[the Bastion bot project].

#### Abilities
* Open issues and PRs
* Comment on issues and PRs

#### Responsibilities
* Comment on issues when they have a reference to the answer.
* If community members aren't sure they are correct and don't have a reference
  to the answer, please leave the issue and try another one.
* Defer to [the Bastion bot team] for answers.
* Make sure to search the issue tracker for similar issues before opening a new
  one.
* Make sure to ask for help in [the Bastion bot Discord server] if it's a
  question and not an issue.
* Any users with support needs are welcome to join [the Bastion bot Discord
  server], and our awesome support team will be happy to help.

PLEASE don't @ [the Bastion bot team] on issues and PR. [The Bastion bot team]
is small, and has many outstanding commitments to fulfill. They already get
notified in [the Bastion bot Discord server] about any new issues and PRs,
and they will get back to you as soon as they can.

### The Bastion Bot Team
The team behind [the Bastion bot project], who have a responsibility to ensure
the stability and functionality of the services/tools offered by us.

Community members may become collaborators by showing consistent, proven track
record of quality contributions to the project, a reasonable level of
proficiency, and regular participation through the tracker, [the Bastion bot
Discord server] and other related mediums, including regular contact with [the
Bastion bot team] itself. This role entails a higher level of responsibility,
so we ask for a higher level of understanding and commitment.

Team members who become inactive for 3 months or longer may have their team
privileges removed until they are ready to return.

#### Abilities
* Label/triage new issues
* Respond to ongoing issues
* Close resolved issues
* Land PRs
* Open issues and PRs in private/restricted repositories
* Comment on issues and PRs in private/restricted repositories.

#### Responsibilities
* Only answer questions when they know the answer, or have a reference to the
  answer.
* If the team members aren't totally confident about their answer, please leave
  the issue and try another one.
* If they've responded to an issue, it becomes their responsibility to see it
  to resolution.
* Close issues if there's no response within a month.
* Defer to fellow team members for answers (Again, please don't @ [the Bastion
  bot team], thank you!)
* Make sure to search the issue tracker for similar issues before opening a new
  one.
* Make sure to ask for help in [the Bastion bot Discord server] if it's a
  question and not an issue.
* Preserve and promote the health of [the Bastion bot project].

> Please note that this is a living document, and [the Bastion bot team] will
> put up PRs to it as needed.

<!-- Links -->
[Community Members]: #community-members
[The Bastion Bot Team]: #the-bastion-bot-team
[The Bastion Bot Project]: https://github.com/TheBastionBot
[TheBastionBot/Bastion]: https://github.com/TheBastionBot/Bastion
[The Bastion Bot Discord Server]: https://discord.gg/fzx8fkt
[Code of Conduct]: CODE_OF_CONDUCT.md

<!--
    Old guidelines

    # Contributing Guidelines

    If you are here, most probably it's because you want to contribute to the
    codebase of the Bastion Bot project. If that's so, let's go through a super
    easy guide (below) to setup a development environment that will be a great
    perquisite to your development process and to maintain a consistent coding
    style across the project.

    *If you want to contribute to the translation of the project, then the right
    place to go is [here](http://i18n.bastionbot.org 'Bastion Bot Translation').*

    ## Let's get aboard

    Make sure that you have [Git](https://git-scm.com/ 'Git Website') and [Node.js](https://nodejs.org 'Node.js Website') `>= v8` installed.

    1. Fork and clone the repository.
    1. Install prerequisites
    ```bash
      # On Debian and Ubuntu based Linux distributions
      sudo apt-get install build-essential python
      # On Enterprise Linux, CentOS and Fedora
      sudo yum groupinstall "Development Tools"
      sudo yum install python

      # On macOS
      xcode-select --install

      # On Windows
      npm install -g windows-build-tools
    ```

    1. Install dependencies
    ```bash
      npm install

      # If you are working on music, you'll also need ffmpeg
      npm install -g ffmpeg-binaries
    ```

    1. Code your heart out!

    1. Run the tests to verify the consistency of the coding style
    and if Bastion boots successfully.
    ```bash
    npm test
    ```
    If you get any errors, fix it. Otherwise, your pull request won't be merged.

    1. [Submit a pull request](https://github.com/TheBastionBot/Bastion/compare)
    to the **dev** branch of this repository.

    1. [Join Bastion's Discord server](https://discord.gg/fzx8fkt),
    if you haven't already, to **claim your perks**.

    ***Thank you for improving the Project.
    You are awesome, and Bastion loves you.***
-->
