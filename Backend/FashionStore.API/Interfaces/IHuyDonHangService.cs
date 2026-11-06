
using FashionStore.API.DTOs.Orders;

namespace FashionStore.API.Interfaces
{
    public interface IHuyDonHangService
    {
        // Khách hàng tự hủy đơn của mình.
        Task<HuyDonHangResponseDto> KhachHangHuyAsync(
            Guid nguoiDungId,
            Guid donHangId,
            HuyDonHangRequestDto request,
            CancellationToken cancellationToken
        );

        // Admin hủy đơn hàng.
        Task<HuyDonHangResponseDto> AdminHuyAsync(
            Guid adminId,
            Guid donHangId,
            HuyDonHangRequestDto request,
            CancellationToken cancellationToken
        );
    }
}
