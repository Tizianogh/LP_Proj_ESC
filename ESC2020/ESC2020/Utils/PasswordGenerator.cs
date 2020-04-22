using System;
using System.Security.Cryptography;
using System.Text;

namespace ESC2020.Utils {
    public class PasswordGenerator {
        public string generateSalt() {
            using (RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider()) {
                byte[] saltBytes = new byte[16];

                rng.GetBytes(saltBytes);

                return formatBytes(saltBytes);
            }
        }

        private string formatBytes(byte[] bytes) {
            return BitConverter.ToString(bytes).Replace("-", string.Empty);
        }

        public string hash(string password, string salt) {
            #region Preconditions
            if (password == null) {
                throw new ArgumentNullException(nameof(password));
            }

            if (salt == null) {
                throw new ArgumentNullException(nameof(salt));
            }
            #endregion

            using (SHA256 sha256Hash = SHA256.Create()) {
                byte[] passwordBytes = Encoding.UTF8.GetBytes(salt + password);

                byte[] hashBytes = sha256Hash.ComputeHash(passwordBytes);

                return formatBytes(hashBytes);
            }
        }

        public bool verify(string password, string hashedPassword, string salt) {
            #region Preconditions
            if (password == null) {
                throw new ArgumentNullException(nameof(password));
            }

            if (hashedPassword == null) {
                throw new ArgumentNullException(nameof(hashedPassword));
            }

            if (salt == null) {
                throw new ArgumentNullException(nameof(salt));
            }
            #endregion

            return hashedPassword.Equals(hash(password, salt));
        }
    }
}
