const obfuscateEmail = (email) => {
  const [localPart, domain] = email.split("@");
  const obfuscatedLocal =
    localPart.slice(0, 2) + "*".repeat(localPart.length - 2);
  return `${obfuscatedLocal}@${domain}`;
};

export default obfuscateEmail;
