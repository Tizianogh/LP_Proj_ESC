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
   public class Class1 {

        
        [TestMethod]
        public   void TestController() {
            //ARRANGE
            var email = "tiziano@gmail.com";
            var builder = new Microsoft.EntityFrameworkCore.DbContextOptionsBuilder<ElectionContext>();
            //  builder.UseNpgsql("Host=localhost;Port=5432;Username=postgres;Password=admin;Database=esc2020;");
            builder.UseInMemoryDatabase(databaseName: "Test");
            var context = new ESC2020.Model.ElectionContext(builder.Options);
            context.User.Add(new Users() { UserId=1, Email= email, Password= "F1BCD6A3FF36745E52ACD514310DFA2D1123DF6C29DBC3AD73EEEEA0DD918D0A", Salt= "7C6F309F825FBE0EF590B8169EDA6978" });
            context.SaveChanges();
            var controller = new ESC2020.Controllers.AuthentificationController(context);

            //ACT
            var user = controller.GetUser(email, "azertyuiop").Result;
   


            //ASSERT
            Assert.IsNotNull(user);
            Assert.AreEqual(email, user.Email);
            Assert.AreEqual(1, user.UserId);

        }
    }

  
}
