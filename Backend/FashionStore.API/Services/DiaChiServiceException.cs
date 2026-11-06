namespace FashionStore.API.Services
{
    public class DiaChiServiceException : Exception
    {
        public int StatusCode { get; }

        public DiaChiServiceException(
            string message,
            int statusCode = 400) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}