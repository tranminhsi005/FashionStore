
namespace FashionStore.API.Services
{
    public class ThanhToanServiceException : Exception
    {
        public int StatusCode { get; }

        public ThanhToanServiceException(
            int statusCode,
            string message
        ) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}
