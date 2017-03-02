using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TODOList.Models;
using TODOList.DatabaseContext;

namespace TODOList.Controllers
{
    public class TodosController : ApiController
    {
        private TodoContext db;

        public TodosController()
        {
            db = new TodoContext();
        }
        public TodosController(TodoContext context)
        {
            db = context;
        }
        // GET api/todos
        public IEnumerable<Todo> Get()
        {
            return db.Todos.ToList();
        }

        // POST api/todos
        public IHttpActionResult Post([FromBody]Todo todo)
        {
            if(ModelState.IsValid)
            {
                db.Todos.Add(todo);
                db.SaveChanges();
                return Ok();
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        // PUT api/todos/5
        public void Put(int id)
        {
            var todo = db.Todos.Find(id);
            todo.Completed = true;
            db.SaveChanges();
        }

        // DELETE api/todos/5
        public void Delete(int id)
        {
            var todo = db.Todos.Find(id);
            db.Todos.Remove(todo);
            db.SaveChanges();
        }
    }
}
