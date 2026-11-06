
using FashionStore.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionStore.API.Controllers
{
    [ApiController]
    [Route("api/v1/kich-co")]
    public class KichCoController : ControllerBase
    {
        private readonly IKichCoService _service;

        public KichCoController(IKichCoService service)
        {
            _service = service;
        }

        // GET: api/v1/kich-co

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> LayDanhSach(
            CancellationToken cancellationToken)
        {
            var ketQua = await _service.LayDanhSachAsync(
                false,
                cancellationToken
            );

            return Ok(new
            {
                success = true,
                data = ketQua
            });
        }
    }
}
