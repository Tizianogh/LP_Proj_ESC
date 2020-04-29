using ESC2020.Controllers;
using ESC2020.Model;
using ESC2020.Tests.Utils;
using ESC2020.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

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

            var context = new ContextFactory().createContex();

            context.Add(new Users() { Email = email, Password = hashedPassword, Salt = salt });
            context.SaveChanges();

            var controller = new AuthentificationController(context, new PasswordGenerator());
            #endregion

            #region ACT
            var user = controller.GetUser(email, password).Result.Value;
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

            var context = new ContextFactory().createContex();

            context.Add(new Users() { Email = email, Password = hashedPassword, Salt = salt });
            context.SaveChanges();

            var controller = new AuthentificationController(context, new PasswordGenerator());
            #endregion

            #region ACT
            var actionResult = controller.GetUser(email, password).Result.Result;
            #endregion

            #region ASSERT
            Assert.IsTrue(actionResult is NotFoundResult);
            #endregion
        }

        [TestMethod]
        public void getUserById() {
            #region ARRANGE
            int id = 1;

            var context = new ContextFactory().createContex();

            context.Add(new Users() { UserId = id });
            context.SaveChanges();

            var controller = new AuthentificationController(context, new PasswordGenerator());
            #endregion

            #region ACT
            var user = controller.GetUsers(id).Result.Value;
            #endregion

            #region ASSERT
            Assert.IsNotNull(user);
            Assert.AreEqual(id, user.UserId);
            #endregion
        }

        [TestMethod]
        public void getNonexistentId() {
            #region ARRANGE
            int id = 1;

            var context = new ContextFactory().createContex();

            var controller = new AuthentificationController(context, new PasswordGenerator());
            #endregion

            #region ACT
            var actionResult = controller.GetUsers(id).Result.Result;
            #endregion

            #region ASSERT
            Assert.IsTrue(actionResult is NotFoundResult);
            #endregion
        }

        [TestMethod]
        public void updateUser() {
            #region ARRANGE
            int id = 1;
            string oldEmail = "test@test.fr";
            string newEmail = "test@test.com";
            Users user = new Users() { UserId = id, Email = oldEmail };

            var context = new ContextFactory().createContex();

            context.Add(user);
            context.SaveChanges();

            var controller = new AuthentificationController(context, new PasswordGenerator());

            user.Email = newEmail;
            #endregion

            #region ACT
            var actionResult = controller.PutUsers(id, user).Result;
            #endregion

            #region ASSERT
            Assert.IsTrue(actionResult is NoContentResult);
            Assert.AreEqual(newEmail, context.User.Find(id).Email);
            #endregion
        }
        
        [TestMethod]
        public void updateIncoherentId() {
            #region ARRANGE
            int correctId = 1;
            int wrongId = 2;
            Users user = new Users() { UserId = correctId };

            var context = new ContextFactory().createContex();

            var controller = new AuthentificationController(context, new PasswordGenerator());
            #endregion

            #region ACT
            var actionResult = controller.PutUsers(wrongId, user).Result;
            #endregion

            #region ASSERT
            Assert.IsTrue(actionResult is BadRequestResult);
            #endregion
        }

        [TestMethod]
        public void updateNonexistentUser() {
            #region ARRANGE
            int id = 1;
            Users user = new Users() { UserId = id };

            var context = new ContextFactory().createContex();

            var controller = new AuthentificationController(context, new PasswordGenerator());
            #endregion

            #region ACT
            var actionResult = controller.PutUsers(id, user).Result;
            #endregion

            #region ASSERT
            Assert.IsTrue(actionResult is NotFoundResult);
            #endregion
        }

        [TestMethod]
        public void addNewUser() {
            #region ARRANGE
            int id = 1;
            Users user = new Users() { UserId = id };

            var context = new ContextFactory().createContex();

            var controller = new AuthentificationController(context, new PasswordGenerator());
            #endregion

            #region ACT
            var actionResult = controller.PostUsers(user).Result.Result;
            #endregion

            #region ASSERT
            Assert.IsNotNull(actionResult is CreatedAtActionResult);
            Assert.IsNotNull(context.User.Find(id));
            #endregion
        }

        [TestMethod]
        public void deleteUser() {
            #region ARRANGE
            int id = 1;

            var context = new ContextFactory().createContex();

            context.Add(new Users() { UserId = id });
            context.SaveChanges();

            var controller = new AuthentificationController(context, new PasswordGenerator());
            #endregion

            #region ACT
            var user = controller.DeleteUsers(id).Result.Value;
            #endregion

            #region ASSERT
            Assert.IsNotNull(user);
            Assert.AreEqual(id, user.UserId);
            #endregion
        }

        [TestMethod]
        public void deleteNonexistentUser() {
            #region ARRANGE
            int id = 1;

            var context = new ContextFactory().createContex();

            var controller = new AuthentificationController(context, new PasswordGenerator());
            #endregion

            #region ACT
            var actionResult = controller.DeleteUsers(id).Result.Result;
            #endregion

            #region ASSERT
            Assert.IsTrue(actionResult is NotFoundResult);
            #endregion
        }
    }
}
