using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;
using Npgsql;
using Microsoft.EntityFrameworkCore;
using ESC2020.Model;
using System.Web.Mvc;
using Microsoft.AspNetCore.Mvc;

namespace ESC2020.Tests {
    [TestClass]
    public class AuthControllerTest {
        [TestMethod]
        public void VerifyEmailAndPassword() {
            #region ARRANGE
            int id = 1;
            string email = "tiziano@gmail.com";
            string password = "F1BCD6A3FF36745E52ACD514310DFA2D1123DF6C29DBC3AD73EEEEA0DD918D0A";
            string salt = "7C6F309F825FBE0EF590B8169EDA6978";
            DateTimeOffset birthDate = new DateTime(1999, 01, 01);
            string description = "compte1";
            string firtsName = "Tiziano";
            string lastName = "Ghisotti";
            string job = "compte1";

            var controller = InMemoryBD.GetAuthDBAuth(id, email, password, salt, birthDate, description, firtsName, lastName, job);
            #endregion

            #region TODO
            var user = controller.GetUser(email, "azertyuiop").Result;
            #endregion

            #region ACT
            Assert.IsNotNull(user, "Le user n'existe pas !");
            Assert.AreEqual(email, user.Email, "L'email de l'utilisateur n'existe pas !");
            #endregion
        }

        [TestMethod]
        public void VerifyId() {
            #region ARRANGE
            int id = 2;
            string email = "tiziano2@gmail.com";
            string password = "F1BCD6A3FF36745E52ACD514310DFA2D1123DF6C29DBC3AD73EEEEA0DD918D0A";
            string salt = "7C6F309F825FBE0EF590B8169EDA6978";
            DateTimeOffset birthDate = new DateTime(1999, 01, 01);
            string description = "compte1";
            string firtsName = "Tiziano";
            string lastName = "Ghisotti";
            string job = "compte1";

            var controller = InMemoryBD.GetAuthDBAuth(id, email, password, salt, birthDate, description, firtsName, lastName, job);
            #endregion

            #region TODO
            var userById = controller.GetUsers(id).Result;
            #endregion

            #region ACT
            Assert.AreEqual(id, userById.UserId, "L'id de l'utilisateur n'existe pas !");
            #endregion
        }

        /* [TestMethod]
         public void VerifyDelete() {
             //ARRANGE
             int id = 3;
             string email = "tiziano3@gmail.com";
             string password = "F1BCD6A3FF36745E52ACD514310DFA2D1123DF6C29DBC3AD73EEEEA0DD918D0A";
             string salt = "7C6F309F825FBE0EF590B8169EDA6978";
             DateTimeOffset birthDate = new DateTime(1999, 01, 01);
             string description = "compte1";
             string firtsName = "Tiziano";
             string lastName = "Ghisotti";
             string job = "compte1";


             var controller = InMemoryBD.GetAuthDBAuth(id, email, password, salt, birthDate, description, firtsName, lastName, job);
             var userById = controller.GetUsers(id).Result;

             Assert.IsNotNull(userById,"L'utilisateur n'existe pas!");
             controller.DeleteUsers(id);
             Assert.IsNull(userById, "L'utilisateur existe !");
         }*/
    }
}
