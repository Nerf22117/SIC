/**
 * Normalizes a username by performing the following transformations:
 * 1. Normalizes the string to Unicode Normalization Form D (NFD).
 * 2. Removes diacritical marks (accents).
 * 3. Converts the string to lowercase.
 * 4. Replaces whitespace characters with underscores.
 * 5. Removes any character that is not a lowercase letter, digit, or underscore.
 *
 * @param {string} username - The username to be normalized.
 * @returns {string} - The normalized username.
 */
export default function normalizeUsername(username) {
  return username
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}
