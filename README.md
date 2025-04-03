# Secure Password Generator

A web-based application that generates secure, random passwords based on user-selected criteria.

## What is Password Entropy?

Password entropy is a measurement of how unpredictable a password is, which directly relates to its strength against brute force attacks. It is typically measured in bits.

### Understanding Entropy

In information theory, entropy represents the amount of uncertainty or randomness in a system. For passwords:

- Higher entropy = more secure password
- Lower entropy = less secure password

### How Entropy is Calculated

The formula for calculating password entropy is: 

$$\text{Entropy (in bits)} = \log_2(C) \times L$$

Where:
- C is the size of the character set (number of possible characters)
- L is the length of the password

### Example Calculations

| Password Scenario | Character Set Size | Length | Entropy Calculation | Total Bits |
|-------------------|-------------------|--------|---------------------|------------|
| Numbers only | 10 characters | 8 digits | Log₂(10) × 8 | 26.6 bits |
| Lowercase letters only | 26 characters | 8 letters | Log₂(26) × 8 | 37.6 bits |
| Mixed case + numbers | 62 characters | 8 chars | Log₂(62) × 8 | 47.6 bits |
| All characters (with symbols) | 95 characters | 8 chars | Log₂(95) × 8 | 52.4 bits |
| All characters | 95 characters | 16 chars | Log₂(95) × 16 | 104.9 bits |

### Entropy Strength Guidelines

| Entropy Level | Security Assessment |
|---------------|---------------------|
| Less than 28 bits | Very weak - easily crackable |
| 28-35 bits | Weak - not suitable for important accounts |
| 36-59 bits | Reasonable - acceptable for most accounts |
| 60-127 bits | Strong - good for sensitive accounts |
| 128+ bits | Very strong - suitable for critical security applications |

### Why Entropy Matters

- A password with 40 bits of entropy would require, on average, 2^39 attempts to crack
- Each additional bit of entropy doubles the number of potential passwords
- Modern computers can check billions of passwords per second

### Improving Password Entropy

- Increase password length (most effective way)
- Use a larger character set (uppercase, lowercase, numbers, symbols)
- Ensure true randomness in password generation
- Avoid patterns and predictable substitutions

Our password generator helps you create high-entropy passwords by allowing you to customize length and character sets while ensuring cryptographically secure randomness. 