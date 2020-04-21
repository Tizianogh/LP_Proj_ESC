using System;
using System.Security.Cryptography;
using System.Text;

namespace ESC2020.Utils {
    public static class HashFunction {
        public static string generateRandomSalt() {
            using (RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider()) {
                byte[] saltBytes = new byte[16];

                rng.GetBytes(saltBytes);

                return BitConverter.ToString(saltBytes).Replace("-", String.Empty);
            }
        }

        public static string hashPassword(string password, string salt) {
            if (password != null && salt != null) {
                using (SHA256 sha256Hash = SHA256.Create()) {
                    byte[] passwordBytes = Encoding.UTF8.GetBytes(salt + password);

                    byte[] hashBytes = sha256Hash.ComputeHash(passwordBytes);

                    return BitConverter.ToString(hashBytes).Replace("-", String.Empty);
                }
            }
            else {
                throw new NullReferenceException("Variable(s) null dans la méthode hashPassword de la classe HashFunction.");
            }
        }

        public static bool verifyPassword(string password, string hashedPassword, string salt) {
            if (password != null && hashedPassword != null && salt != null) {
                return hashedPassword.Equals(hashPassword(password, salt));
            }
            else {
                throw new NullReferenceException("Variable(s) null dans la méthode verifyPassword de la classe HashFunction.");
            }
        }
    }
}
