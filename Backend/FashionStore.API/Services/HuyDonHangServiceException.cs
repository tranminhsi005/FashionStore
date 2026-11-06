
namespace FashionStore.API.Services
{
    public class HuyDonHangServiceException : Exception
    {
        public int StatusCode { get; }

        public HuyDonHangServiceException(
            int statusCode,
            string message
        ) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}
