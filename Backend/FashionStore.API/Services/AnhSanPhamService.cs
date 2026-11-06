using FashionStore.API.Data;
using FashionStore.API.DTOs.Images;
using FashionStore.API.Interfaces;
using FashionStore.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FashionStore.API.Services
{
    public class AnhSanPhamService : IAnhSanPhamService
    {
        private readonly AppDbContext _context;
        private readonly ISupabaseStorageService _storage;
        private readonly ILogger<AnhSanPhamService> _logger;

        private const long DungLuongToiDa = 5 * 1024 * 1024;

        public AnhSanPhamService(
            AppDbContext context,
            ISupabaseStorageService storage,
            ILogger<AnhSanPhamService> logger)
        {
            _context = context;
            _storage = storage;
            _logger = logger;
        }

        public async Task<List<AnhSanPhamAdminResponseDto>> LayDanhSachAsync(
            Guid sanPhamId,
            CancellationToken cancellationToken)
        {
            bool sanPhamTonTai = await _context.SanPhams
                .AnyAsync(x => x.Id == sanPhamId, cancellationToken);

            if (!sanPhamTonTai)
            {
                throw new AnhSanPhamServiceException(
                    "Không tìm thấy sản phẩm.",
                    404
                );
            }

            var danhSach = await _context.AnhSanPhams
                .Where(x => x.SanPhamId == sanPhamId)
                .OrderByDescending(x => x.LaAnhChinh)
                .ThenBy(x => x.ThuTuHienThi)
                .ThenBy(x => x.NgayTao)
                .ToListAsync(cancellationToken);

            return danhSach.Select(ChuyenDoiDto).ToList();
        }

        public async Task<AnhSanPhamAdminResponseDto> UploadAsync(
            Guid sanPhamId,
            TaoAnhSanPhamRequestDto request,
            CancellationToken cancellationToken)
        {
            bool sanPhamTonTai = await _context.SanPhams
                .AnyAsync(x => x.Id == sanPhamId, cancellationToken);

            if (!sanPhamTonTai)
            {
                throw new AnhSanPhamServiceException(
                    "Không tìm thấy sản phẩm.",
                    404
                );
            }

            if (request.File == null || request.File.Length == 0)
            {
                throw new AnhSanPhamServiceException(
                    "Vui lòng chọn ảnh."
                );
            }

            if (request.File.Length > DungLuongToiDa)
            {
                throw new AnhSanPhamServiceException(
                    "Dung lượng ảnh không được vượt quá 5 MB."
                );
            }

            // Đọc nội dung ảnh vào bộ nhớ.
            byte[] noiDung;

            using (var memoryStream = new MemoryStream())
            {
                await request.File.CopyToAsync(
                    memoryStream,
                    cancellationToken
                );

                noiDung = memoryStream.ToArray();
            }

            // Kiểm tra chữ ký file, không chỉ dựa vào phần mở rộng.
            string? contentType = PhatHienLoaiAnh(noiDung);

            if (contentType == null)
            {
                throw new AnhSanPhamServiceException(
                    "File không hợp lệ. Chỉ chấp nhận JPEG, PNG hoặc WebP."
                );
            }

            string duoiFile = contentType switch
            {
                "image/jpeg" => "jpg",
                "image/png" => "png",
                "image/webp" => "webp",
                _ => throw new AnhSanPhamServiceException(
                    "Định dạng ảnh không được hỗ trợ."
                )
            };

            // Tạo đường dẫn riêng cho từng ảnh.
            string tenFile = $"{Guid.NewGuid():N}.{duoiFile}";

            string duongDan =
                $"san-pham/{sanPhamId}/{tenFile}";

            // Upload file lên Supabase Storage trước.
            await _storage.UploadAsync(
                duongDan,
                noiDung,
                contentType,
                cancellationToken
            );

            try
            {
                await using var transaction =
                    await _context.Database.BeginTransactionAsync(
                        cancellationToken
                    );

                var danhSachCu = await _context.AnhSanPhams
                    .Where(x => x.SanPhamId == sanPhamId)
                    .ToListAsync(cancellationToken);

                bool daCoAnhChinh = danhSachCu.Any(x => x.LaAnhChinh);

                // Nếu người dùng chọn ảnh chính hoặc sản phẩm chưa có ảnh chính,
                // bỏ trạng thái ảnh chính của các ảnh cũ.
                bool laAnhChinh =
                    request.LaAnhChinh || !daCoAnhChinh;

                if (laAnhChinh)
                {
                    foreach (var anhCu in danhSachCu)
                    {
                        anhCu.LaAnhChinh = false;
                    }
                }

                var anhMoi = new AnhSanPham
                {
                    Id = Guid.NewGuid(),
                    SanPhamId = sanPhamId,
                    DuongDanLuuTru = duongDan,
                    MoTaAnh = request.MoTaAnh?.Trim(),
                    LaAnhChinh = laAnhChinh,
                    ThuTuHienThi = request.ThuTuHienThi,
                    NgayTao = DateTime.UtcNow
                };

                _context.AnhSanPhams.Add(anhMoi);

                await _context.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);

                return ChuyenDoiDto(anhMoi);
            }
            catch
            {
                // Nếu lưu database thất bại, cố gắng xóa file vừa upload
                // để tránh file rác trên Storage.
                try
                {
                    await _storage.XoaAsync(
                        duongDan,
                        CancellationToken.None
                    );
                }
                catch (Exception ex)
                {
                    _logger.LogError(
                        ex,
                        "Không thể dọn file Storage sau khi lưu ảnh thất bại: {Path}",
                        duongDan
                    );
                }

                throw;
            }
        }

        public async Task XoaAsync(
            Guid anhId,
            CancellationToken cancellationToken)
        {
            var anh = await _context.AnhSanPhams
                .FirstOrDefaultAsync(
                    x => x.Id == anhId,
                    cancellationToken
                );

            if (anh == null)
            {
                throw new AnhSanPhamServiceException(
                    "Không tìm thấy ảnh sản phẩm.",
                    404
                );
            }

            string duongDan = anh.DuongDanLuuTru;

            await using var transaction =
                await _context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            // Nếu xóa ảnh chính, chọn một ảnh khác làm ảnh chính.
            if (anh.LaAnhChinh)
            {
                var anhThayThe = await _context.AnhSanPhams
                    .Where(x =>
                        x.SanPhamId == anh.SanPhamId &&
                        x.Id != anhId)
                    .OrderBy(x => x.ThuTuHienThi)
                    .ThenBy(x => x.NgayTao)
                    .FirstOrDefaultAsync(cancellationToken);

                if (anhThayThe != null)
                {
                    anhThayThe.LaAnhChinh = true;
                }
            }

            _context.AnhSanPhams.Remove(anh);

            await _context.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            // Xóa file ở Storage sau khi database đã lưu thành công.
            // Nếu Storage lỗi, ghi log để có thể xử lý file rác sau.
            try
            {
                await _storage.XoaAsync(
                    duongDan,
                    cancellationToken
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Không thể xóa file ảnh trên Supabase Storage: {Path}",
                    duongDan
                );
            }
        }

        public async Task DatAnhChinhAsync(
            Guid anhId,
            CancellationToken cancellationToken)
        {
            var anh = await _context.AnhSanPhams
                .FirstOrDefaultAsync(
                    x => x.Id == anhId,
                    cancellationToken
                );

            if (anh == null)
            {
                throw new AnhSanPhamServiceException(
                    "Không tìm thấy ảnh sản phẩm.",
                    404
                );
            }

            var danhSach = await _context.AnhSanPhams
                .Where(x => x.SanPhamId == anh.SanPhamId)
                .ToListAsync(cancellationToken);

            foreach (var item in danhSach)
            {
                item.LaAnhChinh = item.Id == anhId;
            }

            await _context.SaveChangesAsync(cancellationToken);
        }

        private AnhSanPhamAdminResponseDto ChuyenDoiDto(
            AnhSanPham anh)
        {
            return new AnhSanPhamAdminResponseDto
            {
                Id = anh.Id,
                SanPhamId = anh.SanPhamId,
                DuongDanAnh = _storage.TaoUrlCongKhai(
                    anh.DuongDanLuuTru
                ),
                MoTaAnh = anh.MoTaAnh,
                LaAnhChinh = anh.LaAnhChinh,
                ThuTuHienThi = anh.ThuTuHienThi,
                NgayTao = anh.NgayTao,
            };
        }

        private static string? PhatHienLoaiAnh(byte[] data)
        {
            // JPEG
            if (data.Length >= 3 &&
                data[0] == 0xFF &&
                data[1] == 0xD8 &&
                data[2] == 0xFF)
            {
                return "image/jpeg";
            }

            // PNG
            if (data.Length >= 8 &&
                data[0] == 0x89 &&
                data[1] == 0x50 &&
                data[2] == 0x4E &&
                data[3] == 0x47 &&
                data[4] == 0x0D &&
                data[5] == 0x0A &&
                data[6] == 0x1A &&
                data[7] == 0x0A)
            {
                return "image/png";
            }

            // WEBP: RIFF....WEBP
            if (data.Length >= 12 &&
                data[0] == 0x52 &&
                data[1] == 0x49 &&
                data[2] == 0x46 &&
                data[3] == 0x46 &&
                data[8] == 0x57 &&
                data[9] == 0x45 &&
                data[10] == 0x42 &&
                data[11] == 0x50)
            {
                return "image/webp";
            }

            return null;
        }
    }
}