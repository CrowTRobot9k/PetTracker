using System.Security.Cryptography;

namespace PetTracker.Infrastucture.Utilities
{
    public static class PasswordGenerator
    {
        private const string LowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        private const string UppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        private const string DigitChars = "0123456789";
        private const string SpecialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

        public static string GenerateTemporaryPassword(int length = 12)
        {
            if (length < 8)
                throw new ArgumentException("Password length must be at least 8 characters", nameof(length));

            using var rng = RandomNumberGenerator.Create();
            var password = new char[length];

            // Ensure at least one character from each required category
            password[0] = GetRandomChar(LowercaseChars, rng);
            password[1] = GetRandomChar(UppercaseChars, rng);
            password[2] = GetRandomChar(DigitChars, rng);
            password[3] = GetRandomChar(SpecialChars, rng);

            // Fill the rest with random characters from all categories
            var allChars = LowercaseChars + UppercaseChars + DigitChars + SpecialChars;
            for (int i = 4; i < length; i++)
            {
                password[i] = GetRandomChar(allChars, rng);
            }

            // Shuffle the password array
            for (int i = 0; i < length; i++)
            {
                int randomIndex = GetRandomInt(rng, i, length);
                (password[i], password[randomIndex]) = (password[randomIndex], password[i]);
            }

            return new string(password);
        }

        private static char GetRandomChar(string chars, RandomNumberGenerator rng)
        {
            int index = GetRandomInt(rng, 0, chars.Length);
            return chars[index];
        }

        private static int GetRandomInt(RandomNumberGenerator rng, int min, int max)
        {
            if (min >= max)
                throw new ArgumentException("min must be less than max");

            var bytes = new byte[4];
            rng.GetBytes(bytes);
            var randomValue = Math.Abs(BitConverter.ToInt32(bytes, 0));
            return min + (randomValue % (max - min));
        }
    }
}
