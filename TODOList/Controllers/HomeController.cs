using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TODOList.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "TODO List";

            return View();
        }

        public ActionResult Tests()
        {
            return View();
        }
    }
}
