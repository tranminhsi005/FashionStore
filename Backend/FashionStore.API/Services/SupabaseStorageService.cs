using System.Net.Http.Headers;
using System.Net.Http.Json;
using FashionStore.API.Configurations;
using FashionStore.API.Interfaces;
using Microsoft.Extensions.Options;

namespace FashionStore.API.Services
{
    public class SupabaseStorageService : ISupabaseStorageService
    {
        private readonly HttpClient _httpClient;
        private readonly SupabaseOptions _options;
        private readonly string _baseUrl;

        public SupabaseStorageService(
            HttpClient httpClient,
            IOptions<SupabaseOptions> options)
        {
            _httpClient = httpClient;
            _options = options.Value;

            if (string.IsNullOrWhiteSpace(_options.Url))
            {
                throw new InvalidOperationException(
                    "Chưa cấu hình Supabase:Url."
                );
            }

            if (string.IsNullOrWhiteSpace(_options.SecretKey))
            {
                throw new InvalidOperationException(
                    "Chưa cấu hình Supabase:SecretKey."
                );
            }

            if (string.IsNullOrWhiteSpace(_options.BucketName))
            {
                throw new InvalidOperationException(
                    "Chưa cấu hình Supabase:BucketName."
                );
            }

            _baseUrl = _options.Url.TrimEnd('/');

            _httpClient.BaseAddress = new Uri(_baseUrl + "/");

            // API key mới của Supabase phải được gửi qua header apikey.
            _httpClient.DefaultRequestHeaders.Add(
                "apikey",
                _options.SecretKey
            );

            // Tương thích với service_role key dạng JWT cũ.
            // Key mới sb_secret_... không được gửi dưới dạng Bearer.
            if (_options.SecretKey.StartsWith(
                "eyJ",
                StringComparison.Ordinal))
            {
                _httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue(
                        "Bearer",
                        _options.SecretKey
                    );
            }
        }

        public async Task UploadAsync(
            string duongDan,
            byte[] noiDung,
            string contentType,
            CancellationToken cancellationToken = default)
        {
            KiemTraDuongDan(duongDan);

            string endpoint = TaoEndpointObject(duongDan);

            using var request = new HttpRequestMessage(
                HttpMethod.Post,
                endpoint
            );

            request.Headers.Add("x-upsert", "false");

            var content = new ByteArrayContent(noiDung);

            content.Headers.ContentType =
                new MediaTypeHeaderValue(contentType);

            request.Content = content;

            using var response = await _httpClient.SendAsync(
                request,
                cancellationToken
            );

            await KiemTraKetQuaAsync(response);
        }

        public async Task XoaAsync(
            string duongDan,
            CancellationToken cancellationToken = default)
        {
            KiemTraDuongDan(duongDan);

            string bucket =
                Uri.EscapeDataString(_options.BucketName);

            using var request = new HttpRequestMessage(
                HttpMethod.Delete,
                $"storage/v1/object/{bucket}"
            );

            request.Content = JsonContent.Create(new
            {
                prefixes = new[] { duongDan }
            });

            using var response = await _httpClient.SendAsync(
                request,
                cancellationToken
            );

            await KiemTraKetQuaAsync(response);
        }

        public string TaoUrlCongKhai(string duongDan)
        {
            KiemTraDuongDan(duongDan);

            string bucket =
                Uri.EscapeDataString(_options.BucketName);

            string objectPath = MaHoaDuongDan(duongDan);

            return $"{_baseUrl}/storage/v1/object/public/{bucket}/{objectPath}";
        }

        private string TaoEndpointObject(string duongDan)
        {
            string bucket =
                Uri.EscapeDataString(_options.BucketName);

            string objectPath = MaHoaDuongDan(duongDan);

            return $"storage/v1/object/{bucket}/{objectPath}";
        }

        private static string MaHoaDuongDan(string duongDan)
        {
            return string.Join(
                "/",
                duongDan.Split('/')
                    .Select(x => Uri.EscapeDataString(x))
            );
        }

        private static void KiemTraDuongDan(string duongDan)
        {
            if (string.IsNullOrWhiteSpace(duongDan))
            {
                throw new ArgumentException(
                    "Đường dẫn file không được để trống."
                );
            }

            if (duongDan.StartsWith("/") ||
                duongDan.Split('/').Any(x =>
                    string.IsNullOrWhiteSpace(x) ||
                    x == "." ||
                    x == ".."))
            {
                throw new ArgumentException(
                    "Đường dẫn file không hợp lệ."
                );
            }
        }

        private static async Task KiemTraKetQuaAsync(
            HttpResponseMessage response)
        {
            if (response.IsSuccessStatusCode)
            {
                return;
            }

            string noiDungLoi =
                await response.Content.ReadAsStringAsync();

            throw new HttpRequestException(
                $"Supabase Storage trả về lỗi " +
                $"{(int)response.StatusCode}: {noiDungLoi}",
                null,
                response.StatusCode
            );
        }
    }
}