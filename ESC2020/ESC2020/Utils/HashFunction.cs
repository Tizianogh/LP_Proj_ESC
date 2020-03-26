using System;
using System.Security.Cryptography;
using System.Text;

namespace ESC2020.Utils {
    public static class HashFunction {
        public static string hashPassword(string password, out string salt) {
            using (RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider()) {
                byte[] saltBytes = new byte[16];

                rng.GetBytes(saltBytes);

                salt = BitConverter.ToString(saltBytes).Replace("-", String.Empty);

                return sha256Hash(password, salt);
            }
        }

        public static bool verifyPassword(string password, string hashedPassword, string salt) {
            return hashedPassword.Equals(sha256Hash(password, salt));
        }

        private static string sha256Hash(string password, string salt) {
            using (SHA256 sha256Hash = SHA256.Create()) {
                byte[] passwordBytes = Encoding.UTF8.GetBytes(salt + password);

                byte[] hashBytes = sha256Hash.ComputeHash(passwordBytes);

                return BitConverter.ToString(hashBytes).Replace("-", String.Empty);
            }
        }
    }
}
