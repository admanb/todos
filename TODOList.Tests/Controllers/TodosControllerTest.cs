using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TODOList;
using TODOList.Controllers;
using Moq;
using System.Data.Entity;
using TODOList.Models;
using TODOList.DatabaseContext;

namespace TODOList.Tests.Controllers
{
    [TestClass]
    public class TodosControllerTest
    {
        private IQueryable<Todo> mockData;
        private Mock<DbSet<Todo>> mockSet;
        private Mock<TodoContext> mockContext;

        private void setupContext ()
        {
            mockData = new List<Todo>
            {
                new Todo { ID = 1, Task = "Task1", Completed = false },
                new Todo { ID = 2, Task = "Task2", Completed = false },
                new Todo { ID = 3, Task = "Task3", Completed = true }
            }.AsQueryable();

            mockSet = new Mock<DbSet<Todo>>();
            mockSet.Setup(m => m.Find(1)).Returns(mockData.First());
            mockSet.As<IQueryable<Todo>>().Setup(m => m.Provider).Returns(mockData.Provider);
            mockSet.As<IQueryable<Todo>>().Setup(m => m.Expression).Returns(mockData.Expression);
            mockSet.As<IQueryable<Todo>>().Setup(m => m.ElementType).Returns(mockData.ElementType);
            mockSet.As<IQueryable<Todo>>().Setup(m => m.GetEnumerator()).Returns(mockData.GetEnumerator());

            mockContext = new Mock<TodoContext>();
            mockContext.Setup(m => m.Todos).Returns(mockSet.Object);
        }
        [TestMethod]
        public void Get()
        {
            // Arrange
            setupContext();
            TodosController controller = new TodosController(mockContext.Object);

            // Act
            IEnumerable<Todo> result = controller.Get();

            // Assert
            Assert.AreEqual(result.Count(), 3);
        }

        [TestMethod]
        public void Post()
        {
            // Arrange
            setupContext();
            TodosController controller = new TodosController(mockContext.Object);

            var dueDate = DateTime.Now;
            var todo = new Todo
            {
                Task = "Task1",
                DueDate = dueDate,
                Details = "Some details"
            };
            // Act
            controller.Post(todo);

            // Assert
            mockSet.Verify(m => m.Add(It.Is<Todo>(t => t.Task.Equals("Task1") 
                                                    && t.DueDate == dueDate 
                                                    && t.Details.Equals("Some details")
                                                    && t.Completed == false)), Times.Once());
            mockContext.Verify(m => m.SaveChanges(), Times.Once());
        }

        [TestMethod]
        public void Put()
        {
            // Arrange
            setupContext();
            TodosController controller = new TodosController(mockContext.Object);

            // Act
            controller.Put(1);

            // Assert
            mockSet.Verify(m => m.Find(It.Is<int>(i => i == 1)), Times.Once());
            mockContext.Verify(m => m.SaveChanges(), Times.Once());
            Assert.AreEqual(mockData.First().Completed, true);
        }

        [TestMethod]
        public void Delete()
        {
            // Arrange
            setupContext();
            TodosController controller = new TodosController(mockContext.Object);

            // Act
            controller.Delete(1);

            // Assert
            mockSet.Verify(m => m.Find(It.Is<int>(i => i == 1)), Times.Once());
            mockSet.Verify(m => m.Remove(It.Is<Todo>(t => t.ID.Equals(1))), Times.Once());
            mockContext.Verify(m => m.SaveChanges(), Times.Once());
        }
    }
}
