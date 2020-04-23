using ESC2020.Controllers;
using ESC2020.Model;
using ESC2020.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;

namespace ESC2020.Tests {
    [TestClass]
    public class ElectionsControllerTests {
        [TestMethod]
        public void getElection() {
            #region ARRANGE
            int electionId = 1;

            var context = new ElectionContextGenerator().getElectionContext("Test", new Election() { ElectionId = electionId });
            var controller = new ElectionsController(context);
            #endregion

            #region ACT
            var election = controller.Getelec().Result;
            #endregion

            #region ASSERT
            Assert.IsNotNull(election);
            Assert.AreEqual(electionId, election.First().ElectionId);
            #endregion
        }
    }
}
