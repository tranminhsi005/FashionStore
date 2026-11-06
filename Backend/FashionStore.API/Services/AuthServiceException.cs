
namespace FashionStore.API.Services
{
    public class AuthServiceException : Exception
    {
        public int StatusCode { get; }

        public AuthServiceException(int statusCode, string message)
            : base(message)
        {
            StatusCode = statusCode;
        }
    }
}
