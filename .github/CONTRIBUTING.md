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
