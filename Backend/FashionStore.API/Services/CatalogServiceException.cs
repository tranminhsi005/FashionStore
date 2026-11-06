
namespace FashionStore.API.Services
{
    public class CatalogServiceException : Exception
    {
        public int StatusCode { get; }

        public CatalogServiceException(
            int statusCode,
            string message) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}
