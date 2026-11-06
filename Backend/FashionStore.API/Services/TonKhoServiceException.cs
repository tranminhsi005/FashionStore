namespace FashionStore.API.Services
{
    public class TonKhoServiceException : Exception
    {
        public int StatusCode { get; }

        public TonKhoServiceException(
            string message,
            int statusCode = 400) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}