using TODOList.Models;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace TODOList.DatabaseContext
{
    public class TodoContext : DbContext
    {
        public TodoContext() : base("TodoContext")
        {
        }

        public virtual DbSet<Todo> Todos { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}