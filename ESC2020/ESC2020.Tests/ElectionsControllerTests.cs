using ESC2020.Controllers;
using ESC2020.Model;
using ESC2020.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ESC2020.Tests {
    [TestClass]
    public class ElectionsControllerTests {
        [TestMethod]
        public void getElection() {
            #region ARRANGE
            int id = 1;

            var context = new ContextFactory().createContex();

            context.Add(new Election() { ElectionId = id });

            var controller = new ElectionsController(context);
            #endregion

            #region ACT
            var election = controller.Getelec().Result;
            #endregion

            #region ASSERT
            Assert.IsNotNull(election);
            //Assert.AreEqual(id, election.First().ElectionId);
            #endregion
        }
    }
}
