using System;
using System.Text.RegularExpressions;
using ESC2020.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ESC2020Tests {
    [TestClass]
    public class PasswordGeneratorTests {
        [TestMethod]
        public void saltPattern() {
            #region ARRANGE
            string pattern = "^[0-9A-F]{32}$";
            Regex rgx = new Regex(pattern);
            PasswordGenerator generator = new PasswordGenerator();
            #endregion

            #region ACT
            string salt = generator.generateSalt();
            bool isMatch = rgx.IsMatch(salt);
            #endregion

            #region ASSERT
            Assert.IsTrue(isMatch);
            #endregion
        }

        [TestMethod]
        public void hashPasswordPattern() {
            #region ARRANGE
            string password = "azertyuiop";
            string salt = "6C3C9D7AE83E66A08DFC1B8EB3078DA4";
            string pattern = "^[0-9A-F]{64}$";
            Regex rgx = new Regex(pattern);
            PasswordGenerator generator = new PasswordGenerator();
            #endregion

            #region ACT
            string hashedPassword = generator.hash(password, salt);
            bool isMatch = rgx.IsMatch(hashedPassword);
            #endregion

            #region ASSERT
            Assert.IsTrue(isMatch);
            #endregion
        }

        [TestMethod]
        public void hashPasswordSuccess() {
            #region ARRANGE
            string password = "azertyuiop";
            string salt = "6C3C9D7AE83E66A08DFC1B8EB3078DA4";
            string expectedHashedPassword = "33DA1B3B89A4603A8C3F0A2F5938A9A44F08E7C32BA8FE57D9F237E48EE7606F";
            PasswordGenerator generator = new PasswordGenerator();
            #endregion

            #region ACT
            string hashedPassword = generator.hash(password, salt);
            #endregion

            #region ASSERT
            Assert.AreEqual(expectedHashedPassword, hashedPassword);
            #endregion
        }

        [TestMethod]
        public void verifyPasswordSuccess() {
            #region ARRANGE
            string password = "azertyuiop";
            string hashedPassword = "33DA1B3B89A4603A8C3F0A2F5938A9A44F08E7C32BA8FE57D9F237E48EE7606F";
            string salt = "6C3C9D7AE83E66A08DFC1B8EB3078DA4";
            PasswordGenerator generator = new PasswordGenerator();
            #endregion

            #region ACT
            bool isValid = generator.verify(password, hashedPassword, salt);
            #endregion

            #region ASSERT
            Assert.IsTrue(isValid);
            #endregion
        }

        [TestMethod]
        public void wrongPassword() {
            #region ARRANGE
            string password = "12345";
            string hashedPassword = "33DA1B3B89A4603A8C3F0A2F5938A9A44F08E7C32BA8FE57D9F237E48EE7606F";
            string salt = "6C3C9D7AE83E66A08DFC1B8EB3078DA4";
            PasswordGenerator generator = new PasswordGenerator();
            #endregion

            #region ACT
            bool isValid = generator.verify(password, hashedPassword, salt);
            #endregion

            #region ASSERT
            Assert.IsFalse(isValid);
            #endregion
        }

        [TestMethod]
        public void wrongSalt() {
            #region ARRANGE
            string password = "azertyuiop";
            string hashedPassword = "33DA1B3B89A4603A8C3F0A2F5938A9A44F08E7C32BA8FE57D9F237E48EE7606F";
            string salt = "9999B2932C74629E96D7D97045DB60C0";
            PasswordGenerator generator = new PasswordGenerator();
            #endregion

            #region ACT
            bool isValid = generator.verify(password, hashedPassword, salt);
            #endregion

            #region ASSERT
            Assert.IsFalse(isValid);
            #endregion
        }


        [TestMethod]
        public void hashPasswordNull() {
            #region ARRANGE
            string password = null;
            string salt = null;
            ArgumentNullException exception = null;
            PasswordGenerator generator = new PasswordGenerator();
            #endregion

            #region ACT
            try {
                generator.hash(password, salt);
            }
            catch (ArgumentNullException e) {
                exception = e;
            }
            #endregion

            #region ASSERT
            Assert.IsNotNull(exception);
            #endregion
        }

        [TestMethod]
        public void verifyPasswordNull() {
            #region ARRANGE
            string password = null;
            string hashedPassword = null;
            string salt = null;
            ArgumentNullException exception = null;
            PasswordGenerator generator = new PasswordGenerator();
            #endregion

            #region ACT
            try {
                generator.verify(password, hashedPassword, salt);
            }
            catch (ArgumentNullException e) {
                exception = e;
            }
            #endregion

            #region ASSERT
            Assert.IsNotNull(exception);
            #endregion
        }
    }
}
