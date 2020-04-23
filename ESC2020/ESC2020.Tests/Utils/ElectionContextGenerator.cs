using ESC2020.Model;
using Microsoft.EntityFrameworkCore;

namespace ESC2020.Tests.Utils {
    public class ElectionContextGenerator {
        public ElectionContext getElectionContext(string databaseName, Users user) {
            var builder = new DbContextOptionsBuilder<ElectionContext>();
            builder.UseInMemoryDatabase(databaseName);

            var context = new ElectionContext(builder.Options);
            context.User.Add(user);
            context.SaveChanges();

            return context;
        }

        public ElectionContext getElectionContext(string databaseName, Election election) {
            var builder = new DbContextOptionsBuilder<ElectionContext>();
            builder.UseInMemoryDatabase(databaseName);

            var context = new ElectionContext(builder.Options);
            context.elec.Add(election);
            context.SaveChanges();

            return context;
        }
    }
}
