using ESC2020.Model;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;

namespace ESC2020.Tests {
   [TestClass]
   public class ElecControllerTest {
        [TestMethod]
        public void GetElection() {
            #region ARRANGE
            int electionId = 1;
            string job = "test";
            string mission = "test";
            string responsability = "test";
            DateTimeOffset startDate = new DateTime(2020, 01, 01);
            DateTimeOffset endDate = new DateTime(2020, 02, 02);
            string codeElection = "test";

            var controller = InMemoryBD.GetAuthDBElec(electionId, job, mission, responsability, startDate, endDate, codeElection);
            #endregion

            #region TODO
            var election = controller.Getelec().Result;
            #endregion

            #region ACT
            Console.WriteLine("election : " + election);
            Console.WriteLine("enumerator : " + election.GetEnumerator());
            election.GetEnumerator().MoveNext();
            Console.WriteLine("current : " + election.GetEnumerator().Current);
            
            
            Assert.IsNotNull(election, "Election vide !"); 
          
            #endregion
        }
    }
}
