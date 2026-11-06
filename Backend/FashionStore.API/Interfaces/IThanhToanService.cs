
using FashionStore.API.DTOs.Payments;

namespace FashionStore.API.Interfaces
{
    public interface IThanhToanService
    {
        Task<XacNhanDaGiaoCODResponseDto> XacNhanDaGiaoCODAsync(
            Guid adminId,
            Guid donHangId,
            XacNhanDaGiaoCODRequestDto request,
            CancellationToken cancellationToken
        );
    }
}
