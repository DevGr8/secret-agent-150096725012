# Black//Box Secret Agent Hacker Terminal

**Live Web Link:** https://devgr8.github.io/secret-agent/

**Created by:** Ayush Kumar Singh  
**Student #150096725012**

A retro matrix-style educational terminal simulation built for the AI Coding Lab. It combines a fake command-line interface, animated mission progress, sound toggle, and a hidden Caesar-shift cipher mini-game. It is strictly a simulation and does not access real systems.

## How to play

1. Open the live link or `index.html`.
2. Type `help`, `scan`, `decrypt`, or `status` in the terminal.
3. In Cipher Breaker, decode the displayed letters using Caesar shift -3.
4. Enter the decoded word and submit it.
5. Use Restart Challenge to generate a new cipher.

## Secret Features

- Sound toggle UI for optional terminal feedback.
- Mission progress meter that updates automatically.
- Responsive layout for desktop and mobile screens.
- Safe command handling with an educational simulation disclaimer.
- Automatic `console.assert()` checks for normal, empty, and negative inputs.

## Debugging note

The intentional debugging exercise was represented by testing the cipher function with edge cases. The assertions verify that empty and negative inputs return safe values instead of crashing.

## Files

- `index.html` — single-file HTML, CSS, and JavaScript deliverable.
- `app/` — Next.js preview version used during development.
