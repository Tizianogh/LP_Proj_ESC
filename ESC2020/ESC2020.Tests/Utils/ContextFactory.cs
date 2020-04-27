using ESC2020.Model;
using Microsoft.EntityFrameworkCore;
using System;

namespace ESC2020.Tests.Utils {
    public class ContextFactory {
        public ElectionContext createContex() {
            string databaseName = Guid.NewGuid().ToString();

            var builder = new DbContextOptionsBuilder<ElectionContext>();

            builder.UseInMemoryDatabase(databaseName);

            return new ElectionContext(builder.Options);
        }
    }
}
