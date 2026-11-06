namespace FashionStore.API.Interfaces
{
    public interface ISupabaseStorageService
    {
        Task UploadAsync(
            string duongDan,
            byte[] noiDung,
            string contentType,
            CancellationToken cancellationToken = default
        );

        Task XoaAsync(
            string duongDan,
            CancellationToken cancellationToken = default
        );

        string TaoUrlCongKhai(string duongDan);
    }
}