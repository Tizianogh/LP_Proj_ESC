using ESC2020.Model;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace ESC2020.Tests {
    public static class InMemoryBD {
        public static ESC2020.Controllers.AuthentificationController  GetAuthDBAuth (int id, string email, string password, string salt, DateTimeOffset birthDate, string description, string firstName, string lastName, string job) {
            var builder = new Microsoft.EntityFrameworkCore.DbContextOptionsBuilder<ElectionContext>();
            builder.UseInMemoryDatabase(databaseName: "Test");

            var context = new ESC2020.Model.ElectionContext(builder.Options);
            context.User.Add(new Users() { UserId = id, Email = email, Password = password, Salt = salt, BirthDate = birthDate, Description = description, FirstName = firstName, LastName = lastName, Job = job });
            context.SaveChanges();

            var controller = new ESC2020.Controllers.AuthentificationController(context);
            //builder.UseNpgsql("Host=localhost;Port=5432;Username=postgres;Password=admin;Database=esc2020;");

            return controller;
        }

        public static ESC2020.Controllers.ElectionsController GetAuthDBElec(int electionId, string job, string mission, string responsability, DateTimeOffset startDate, DateTimeOffset endDate, string codeElection){
            var builder = new Microsoft.EntityFrameworkCore.DbContextOptionsBuilder<ElectionContext>();
            builder.UseInMemoryDatabase(databaseName: "Test2");
            
            var context = new ESC2020.Model.ElectionContext(builder.Options);
            context.elec.Add(new Election() { ElectionId = electionId, Job = job, Mission = mission, Responsability = responsability, StartDate = startDate, EndDate = endDate, CodeElection = codeElection });
            
            var controller = new ESC2020.Controllers.ElectionsController(context);
            
            return controller;
        }
    }
}
