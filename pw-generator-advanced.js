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
      // Calculate entropy (bits of randomness)
      const selectedMode = document.querySelector('input[name="passwordMode"]:checked').value;
      let charPoolSize = 0;
      let entropy = 0;
      
      if (selectedMode === 'strong') {
        // For strong mode: 26 lowercase letters + 10 numbers + 2 fixed hyphens
        charPoolSize = 26;
        // Entropy calculation for Apple-style format is a bit different
        // 26^6 (first section) * 26^5 * 10 * 6 (middle section with number placement) * 26^6 (last section)
        entropy = Math.log2(Math.pow(26, 6) * Math.pow(26, 5) * 10 * 6 * Math.pow(26, 6));
      } else if (selectedMode === 'noSpecial') {
        // For no special characters mode: 26 uppercase + 26 lowercase + 10 numbers
        charPoolSize = 62;
        entropy = Math.log2(Math.pow(charPoolSize, password.length));
      } else {
        // Original calculation for free mode
        if (uppercaseCheck.checked) charPoolSize += 26;
        if (lowercaseCheck.checked) charPoolSize += 26;
        if (numbersCheck.checked) charPoolSize += 10;
        if (symbolsCheck.checked) charPoolSize += 33; // Approximation for symbols
        
        entropy = Math.log2(Math.pow(charPoolSize, password.length));
      }
      
      document.getElementById('entropy').textContent = entropy.toFixed(2) + ' bits';
      
      // Start with maximum score based on entropy
      let strengthScore = 100;
      
      // Check for weak patterns and reduce points
      
      // 1. Check for sequential characters (like "abcdef" or "123456")
      if (hasSequentialChars(password)) {
        strengthScore -= 20;
      }
      
      // 2. Check for repeated characters (like "aaa" or "111")
      if (hasRepeatedChars(password)) {
        strengthScore -= 20;
      }
      
      // 3. Check for keyboard patterns (like "qwerty" or "asdfgh")
      if (hasKeyboardPattern(password)) {
        strengthScore -= 20;
      }
      
      // 4. Check for lack of character diversity
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSymbol = /[^A-Za-z0-9]/.test(password);
      
      const charTypeCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
      
      if (charTypeCount === 1) {
        strengthScore -= 30;
      } else if (charTypeCount === 2) {
        strengthScore -= 15;
      } else if (charTypeCount === 3) {
        strengthScore -= 5;
      }
      
      // 5. Check for short passwords
      if (password.length < 8) {
        strengthScore -= 30;
      } else if (password.length < 12) {
        strengthScore -= 15;
      } else if (password.length < 16) {
        strengthScore -= 5;
      }
      
      // Ensure score doesn't go below 0
      strengthScore = Math.max(0, strengthScore);
      
      // Map score to strength text and color
      let strengthText = '';
      let strengthColor = '';
      
      if (strengthScore < 40) {
        strengthText = 'Weak';
        strengthColor = '#ff4d4d';
      } else if (strengthScore < 70) {
        strengthText = 'Medium';
        strengthColor = '#ffaa00';
      } else {
        strengthText = 'Strong';
        strengthColor = '#00cc44';
      }
      
      strengthIndicator.textContent = strengthText;
      strengthIndicator.style.color = strengthColor;
    };
  
    // Helper function to check for sequential characters
    const hasSequentialChars = (password) => {
      const sequences = ['abcdefghijklmnopqrstuvwxyz', '0123456789'];
      
      for (const seq of sequences) {
        for (let i = 0; i < seq.length - 2; i++) {
          const pattern = seq.substring(i, i + 3);
          if (password.toLowerCase().includes(pattern)) {
            return true;
          }
        }
      }
      
      return false;
    };
  
    // Helper function to check for repeated characters
    const hasRepeatedChars = (password) => {
      return /(.)\1{2,}/.test(password); // Checks for 3 or more same characters in a row
    };
  
    // Helper function to check for keyboard patterns
    const hasKeyboardPattern = (password) => {
      const keyboardPatterns = [
        'qwert', 'asdfg', 'zxcvb', 'yuiop', 'hjkl', 'nm',
        '12345', '67890', '!@#$%'
      ];
      
      for (const pattern of keyboardPatterns) {
        if (password.toLowerCase().includes(pattern)) {
          return true;
        }
      }
      
      return false;
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