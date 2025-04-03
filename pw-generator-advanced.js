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
    const customOptions = document.getElementById('customOptions');
    const modeRadios = document.querySelectorAll('input[name="passwordMode"]');
  
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
    
    // Mode selection handler
    modeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            // Show/hide custom options based on mode
            if (radio.value === 'free') {
                customOptions.style.display = 'block';
            } else {
                customOptions.style.display = 'none';
            }
        });
    });
  
    // Generate password using Web Crypto API
    const generatePassword = () => {
        const selectedMode = document.querySelector('input[name="passwordMode"]:checked').value;
        
        if (selectedMode === 'strong') {
            generateStrongPassword();
        } else if (selectedMode === 'noSpecial') {
            generateNoSpecialPassword();
        } else {
            generateFreePassword();
        }
    };
    
    // Generate Apple-style strong password (format: xxxxx-xxxNx-xxxxx)
    const generateStrongPassword = () => {
        let password = '';
        
        // First section: 6 lowercase letters
        password += generateRandomString(lowercase, 6);
        
        // Add hyphen
        password += '-';
        
        // Middle section: 5 lowercase letters with 1 number
        const middleLetters = generateRandomString(lowercase, 5);
        const randomNumber = generateRandomString(numbers, 1);
        const randomPosition = Math.floor(Math.random() * 6); // Position 0-5
        
        // Insert the number at the random position
        const middlePart = middleLetters.substring(0, randomPosition) + 
                          randomNumber + 
                          middleLetters.substring(randomPosition);
        
        password += middlePart;
        
        // Add hyphen
        password += '-';
        
        // Last section: 6 lowercase letters
        password += generateRandomString(lowercase, 6);
        
        // Update UI
        passwordOutput.value = password;
        updateStrengthIndicator(password);
    };
    
    // Generate password without special characters (mixed case + numbers)
    const generateNoSpecialPassword = () => {
        const charset = uppercase + lowercase + numbers;
        const length = 16; // Fixed length like the example
        
        // Generate password ensuring at least one uppercase, one lowercase, and one number
        let password;
        do {
            password = generateRandomString(charset, length);
        } while (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password));
        
        // Update UI
        passwordOutput.value = password;
        updateStrengthIndicator(password);
    };
    
    // Original free-form password generator
    const generateFreePassword = () => {
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
        password = generateRandomString(charset, length);
    
        // Update UI
        passwordOutput.value = password;
        updateStrengthIndicator(password);
    };
    
    // Helper function to generate a random string using Web Crypto API
    const generateRandomString = (charset, length) => {
        let result = '';
        const randomValues = new Uint32Array(length);
        window.crypto.getRandomValues(randomValues);
        
        for (let i = 0; i < length; i++) {
            // Use modulo to get index within charset range
            const randomIndex = randomValues[i] % charset.length;
            result += charset[randomIndex];
        }
        
        return result;
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
      const selectedMode = document.querySelector('input[name="passwordMode"]:checked').value;
      let charPoolSize = 0;
      
      if (selectedMode === 'strong') {
        // For strong mode: 26 lowercase letters + 10 numbers + 2 fixed hyphens
        charPoolSize = 26;
        // Entropy calculation for Apple-style format is a bit different
        // 26^6 (first section) * 26^5 * 10 * 6 (middle section with number placement) * 26^6 (last section)
        const entropy = Math.log2(Math.pow(26, 6) * Math.pow(26, 5) * 10 * 6 * Math.pow(26, 6));
        document.getElementById('entropy').textContent = entropy.toFixed(2) + ' bits';
      } else if (selectedMode === 'noSpecial') {
        // For no special characters mode: 26 uppercase + 26 lowercase + 10 numbers
        charPoolSize = 62;
        const entropy = Math.log2(Math.pow(charPoolSize, password.length));
        document.getElementById('entropy').textContent = entropy.toFixed(2) + ' bits';
      } else {
        // Original calculation for free mode
        if (uppercaseCheck.checked) charPoolSize += 26;
        if (lowercaseCheck.checked) charPoolSize += 26;
        if (numbersCheck.checked) charPoolSize += 10;
        if (symbolsCheck.checked) charPoolSize += 33; // Approximation for symbols
        
        const entropy = Math.log2(Math.pow(charPoolSize, password.length));
        document.getElementById('entropy').textContent = entropy.toFixed(2) + ' bits';
      }
      
      let entropyScore = 0;
      const entropy = parseFloat(document.getElementById('entropy').textContent);
      
      if (entropy < 28) entropyScore = 0;
      else if (entropy < 36) entropyScore = 1;
      else if (entropy < 60) entropyScore = 2;
      else if (entropy < 80) entropyScore = 3;
      else if (entropy < 100) entropyScore = 4;
      else entropyScore = 5;

      strength += entropyScore;
      
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