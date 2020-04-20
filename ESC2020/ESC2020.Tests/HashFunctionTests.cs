using System;
using ESC2020.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ESC2020Tests {
    [TestClass]
    public class HashFunctionTests {

        [TestMethod]
        public void sha256HashSuccess() {
            //ARRANGE
            #region ARRANGE
            string password = "azertyuiop";
            string salt;

            //TODO: S�parer les responsabilit�s (Random s�curis� // hash) et les tester s�par�ment
            string hashedPassword = HashFunction.hashPassword(password, out salt);
            #endregion

            //ACT
            bool isValid = HashFunction.verifyPassword(password, hashedPassword, salt);

            //ASSERT
            Assert.IsTrue(isValid);
        }

        [TestMethod]
        public void sha256HashFailure() {
            string password = "azertyuiop";
            string salt;

            string hashedPassword = HashFunction.hashPassword(password, out salt);

            Assert.AreEqual(false, HashFunction.verifyPassword("12345", hashedPassword, salt));
        }
    }
}
