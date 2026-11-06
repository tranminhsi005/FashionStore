namespace FashionStore.API.Services
{
    public class GioHangServiceException : Exception
    {
        public int StatusCode { get; }

        public GioHangServiceException(
            string message,
            int statusCode = 400) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}