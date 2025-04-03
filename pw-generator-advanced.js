/**
 * Password Generator with Web Crypto API
 * Uses cryptographically strong random values for better security
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const passwordOutput = document.getElementById('password');
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('lengthValue');
    const uppercaseCheck = document.getElementById('uppercase');
    const lowercaseCheck = document.getElementById('lowercase');
    const numbersCheck = document.getElementById('numbers');
    const symbolsCheck = document.getElementById('symbols');
    const excludeAmbiguousCheck = document.getElementById('excludeAmbiguous');
    const generateBtn = document.getElementById('generate');
    const copyBtn = document.getElementById('copy');
    const strengthIndicator = document.getElementById('strength');
  
    // Character sets
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const ambiguousChars = 'Il1O0o{}[]()\/\'\"`|,;:.';
  
    // Initialize
    lengthValue.textContent = lengthSlider.value;
    lengthSlider.addEventListener('input', () => {
      lengthValue.textContent = lengthSlider.value;
    });
  
    // Generate password using Web Crypto API
    const generatePassword = () => {
      let charset = '';
      let password = '';
      
      // Build character set based on options
      if (uppercaseCheck.checked) charset += uppercase;
      if (lowercaseCheck.checked) charset += lowercase;
      if (numbersCheck.checked) charset += numbers;
      if (symbolsCheck.checked) charset += symbols;
  
      // Remove ambiguous characters if the option is checked
      if (excludeAmbiguousCheck.checked && charset !== '') {
        charset = Array.from(charset)
          .filter(char => !ambiguousChars.includes(char))
          .join('');
      }
  
      // Ensure at least one option is selected
      if (charset === '') {
        alert('Please select at least one character type');
        return;
      }
  
      const length = parseInt(lengthSlider.value);
      
      // Generate random indices using Web Crypto API
      const randomValues = new Uint32Array(length);
      window.crypto.getRandomValues(randomValues);
      
      // Build password using the random values
      for (let i = 0; i < length; i++) {
        // Use modulo to get index within charset range
        const randomIndex = randomValues[i] % charset.length;
        password += charset[randomIndex];
      }
  
      // Update UI
      passwordOutput.value = password;
      updateStrengthIndicator(password);
    };
  
    // Calculate and display password strength
    const updateStrengthIndicator = (password) => {
      let strength = 0;
      
      // Length check
      if (password.length >= 12) strength += 1;
      if (password.length >= 16) strength += 1;
      
      // Character variety check
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[a-z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      
      // Calculate entropy (bits of randomness)
      let charPoolSize = 0;
      if (uppercaseCheck.checked) charPoolSize += 26;
      if (lowercaseCheck.checked) charPoolSize += 26;
      if (numbersCheck.checked) charPoolSize += 10;
      if (symbolsCheck.checked) charPoolSize += 33; // Approximation for symbols
      
      const entropy = Math.log2(Math.pow(charPoolSize, password.length));
      if (entropy > 60) strength += 1;
      if (entropy > 80) strength += 1;
      if (entropy > 100) strength += 1;
      
      // Update strength indicator
      let strengthText = '';
      let strengthColor = '';
      
      if (strength < 3) {
        strengthText = 'Weak';
        strengthColor = '#ff4d4d';
      } else if (strength < 5) {
        strengthText = 'Medium';
        strengthColor = '#ffaa00';
      } else {
        strengthText = 'Strong';
        strengthColor = '#00cc44';
      }
      
      strengthIndicator.textContent = strengthText;
      strengthIndicator.style.color = strengthColor;
    };
  
    // Copy password to clipboard
    const copyPassword = () => {
      if (!passwordOutput.value) return;
      
      passwordOutput.select();
      document.execCommand('copy');
      
      // Show copied notification
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 1500);
    };
  
    // Event listeners
    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyPassword);
    
    // Generate initial password
    generatePassword();
  });