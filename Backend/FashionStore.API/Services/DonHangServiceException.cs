
namespace FashionStore.API.Services
{
    public class DonHangServiceException : Exception
    {
        public int StatusCode { get; }

        public DonHangServiceException(
            int statusCode,
            string message
        ) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}
