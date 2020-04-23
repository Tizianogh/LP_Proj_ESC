using ESC2020.Controllers;
using ESC2020.Model;
using ESC2020.Tests.Utils;
using ESC2020.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ESC2020.Tests {
    [TestClass]
    public class AuthentificationControllerTests {
        [TestMethod]
        public void connectionSuccess() {
            #region ARRANGE
            string email = "test@test.fr";
            string password = "azertyuiop";
            string hashedPassword = "33DA1B3B89A4603A8C3F0A2F5938A9A44F08E7C32BA8FE57D9F237E48EE7606F";
            string salt = "6C3C9D7AE83E66A08DFC1B8EB3078DA4";

            var context = new ElectionContextGenerator().getElectionContext("Test", new Users() { Email = email, Password = hashedPassword, Salt = salt });
            var controller = new AuthentificationController(context, new PasswordGenerator());
            #endregion

            #region ACT
            var user = controller.GetUser(email, password).Result;
            #endregion

            #region ASSERT
            Assert.IsNotNull(user);
            Assert.AreEqual(email, user.Email);
            #endregion
        }

        [TestMethod]
        public void wrongPassword() {
            #region ARRANGE
            string email = "test@test.fr";
            string password = "12345";
            string hashedPassword = "33DA1B3B89A4603A8C3F0A2F5938A9A44F08E7C32BA8FE57D9F237E48EE7606F";
            string salt = "6C3C9D7AE83E66A08DFC1B8EB3078DA4";

            var context = new ElectionContextGenerator().getElectionContext("Test", new Users() { Email = email, Password = hashedPassword, Salt = salt });
            var controller = new AuthentificationController(context, new PasswordGenerator());
            #endregion

            #region ACT
            var user = controller.GetUser(email, password).Result;
            #endregion

            #region ASSERT
            Assert.IsNull(user);
            #endregion
        }
    }
}
