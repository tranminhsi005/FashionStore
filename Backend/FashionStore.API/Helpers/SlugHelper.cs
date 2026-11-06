
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace FashionStore.API.Helpers
{
    public static class SlugHelper
    {
        public static string TaoSlug(string noiDung)
        {
            if (string.IsNullOrWhiteSpace(noiDung))
            {
                return string.Empty;
            }

            noiDung = noiDung.Trim().ToLowerInvariant();

            // Chuyen d thanh d, truoc khi xu ly dau tieng Viet
            noiDung = noiDung.Replace('đ', 'd');

            // Tach ky tu Unicode va loai bo dau
            string normalized = noiDung.Normalize(
                NormalizationForm.FormD
            );

            StringBuilder builder = new StringBuilder();

            foreach (char c in normalized)
            {
                UnicodeCategory category =
                    CharUnicodeInfo.GetUnicodeCategory(c);

                if (category != UnicodeCategory.NonSpacingMark)
                {
                    builder.Append(c);
                }
            }

            string ketQua = builder
                .ToString()
                .Normalize(NormalizationForm.FormC);

            ketQua = Regex.Replace(
                ketQua,
                @"[^a-z0-9]+",
                "-"
            );

            return ketQua.Trim('-');
        }
    }
}
