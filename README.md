# Secure Password Generator

A cryptographically secure password generator with multiple modes and strength analysis.

## Live Demo

Visit [https://ericc55.github.io/pw-generator/](https://ericc55.github.io/pw-generator/) to try it out!

## Features

- **3 Password Generation Modes**:
  - Free Mode: Fully customizable passwords
  - Strong Password (Apple style): Format like xxxxx-xxxNx-xxxxx
  - No Special Characters (Apple style): Mixed case letters and numbers only

- **Security Features**:
  - Uses Web Crypto API for cryptographically strong random values
  - Password strength analysis with entropy calculation
  - Detection of common password weaknesses

- **Customization Options**:
  - Adjustable password length
  - Character type selection (uppercase, lowercase, numbers, symbols)
  - Option to exclude ambiguous characters

- **User-Friendly Interface**:
  - One-click copy to clipboard
  - Real-time password strength indicator
  - Password testing tool

## How to Use

1. Select your preferred password generation mode
2. Customize options if using Free Mode
3. Click "Generate Password"
4. Copy the password with the "Copy" button

## Password Strength Testing

Use the "Test Password Strength Algorithm" button to:
- See how the strength analyzer evaluates known weak passwords
- Test your own passwords to check their strength

## Technical Details

- Built with vanilla JavaScript
- Uses the Web Crypto API for secure random number generation
- Calculates password entropy and analyzes common weaknesses