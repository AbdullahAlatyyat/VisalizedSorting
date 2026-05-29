using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using VisualizedAlgorithms.Models;

namespace VisualizedAlgorithms.Controllers;

public class HomeController : Controller
{
    [Route("/")]
    public IActionResult Index()
    {
        return View();
    }

    [Route("/Sorting")]
    public IActionResult Sorting()
    {
        return View();
    }

    [Route("/Trees")]
    public IActionResult Trees()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
