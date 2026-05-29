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

    [Route("/Graphs")]
    public IActionResult Graphs()
    {
        return View();
    }

    [Route("/DynamicProgramming")]
    public IActionResult DynamicProgramming()
    {
        return View();
    }

    [Route("/Greedy")]
    public IActionResult Greedy()
    {
        return View();
    }

    [Route("/SearchingHashing")]
    public IActionResult SearchingHashing()
    {
        return View();
    }

    [Route("/Heaps")]
    public IActionResult Heaps()
    {
        return View();
    }

    [Route("/Strings")]
    public IActionResult Strings()
    {
        return View();
    }

    [Route("/DivideConquer")]
    public IActionResult DivideConquer()
    {
        return View();
    }

    [Route("/Geometry")]
    public IActionResult Geometry()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
