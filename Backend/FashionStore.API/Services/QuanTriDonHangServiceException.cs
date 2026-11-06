
namespace FashionStore.API.Services
{
    public class QuanTriDonHangServiceException : Exception
    {
        public int StatusCode { get; }

        public QuanTriDonHangServiceException(
            int statusCode,
            string message
        ) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}
