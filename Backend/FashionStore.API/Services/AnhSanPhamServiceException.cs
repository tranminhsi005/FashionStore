namespace FashionStore.API.Services
{
    public class AnhSanPhamServiceException : Exception
    {
        public int StatusCode { get; }

        public AnhSanPhamServiceException(
            string message,
            int statusCode = 400) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}