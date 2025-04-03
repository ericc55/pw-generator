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
| Lowercase letters + numbers | 36 characters | 8 chars | Log₂(36) × 8 | 41.4 bits |
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

## Expected Time to Crack

The time required to crack a password depends on its entropy and the attacker's computing power. The formula for estimating crack time is:

$$\text{Time (in years)} = \frac{S}{A \times 6.308 \times 10^7}$$

Where:
- S is the sample space (2^entropy)
- A is the number of attempts per second (depends on hardware)

### Hardware Capabilities

Modern attack capabilities:
- Consumer-grade hardware: ~170 billion SHA-1 hashes per second
- Enterprise or state-level resources: potentially trillions of attempts per second

### Example Crack Times

Based on modern consumer hardware capabilities (~170 billion attempts per second):

| Entropy | Expected Crack Time |
|---------|---------------------|
| 30 bits | Less than 1 second |
| 40 bits | Seconds |
| 50 bits | Minutes |
| 60 bits | 39 days |
| 80 bits | 112 thousand years |
| 100 bits | 118 billion years |


> Auth0 Blog: [Defending Against Password Cracking: Understanding the Math](https://auth0.com/blog/defending-against-password-cracking-understanding-the-math/)

It's important to note that as technology advances, the time required to crack passwords will decrease. What might take years today could take hours in the future.

### Password Security Recommendations

To ensure your passwords remain secure:
- Aim for at least 70-80 bits of entropy for important accounts
- For critical security, aim for 100+ bits of entropy
- Remember that password length has a greater impact on entropy than character set diversity
- Regularly update passwords for sensitive accounts

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