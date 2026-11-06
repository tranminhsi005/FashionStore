using FashionStore.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FashionStore.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // =====================================================
        // 1. TAI KHOAN VA DIA CHI
        // =====================================================

        public DbSet<NguoiDung> NguoiDungs => Set<NguoiDung>();

        public DbSet<VaiTro> VaiTros => Set<VaiTro>();

        public DbSet<NguoiDungVaiTro> NguoiDungVaiTros => Set<NguoiDungVaiTro>();

        public DbSet<PhienDangNhap> PhienDangNhaps => Set<PhienDangNhap>();

        public DbSet<DiaChiGiaoHang> DiaChiGiaoHangs => Set<DiaChiGiaoHang>();

        // =====================================================
        // 2. DANH MUC VA THUONG HIEU
        // =====================================================

        public DbSet<DanhMuc> DanhMucs => Set<DanhMuc>();

        public DbSet<ThuongHieu> ThuongHieus => Set<ThuongHieu>();

        // =====================================================
        // 3. KICH CO, MAU SAC, SAN PHAM VA BIEN THE
        // =====================================================

        public DbSet<KichCo> KichCos => Set<KichCo>();

        public DbSet<MauSac> MauSacs => Set<MauSac>();

        public DbSet<SanPham> SanPhams => Set<SanPham>();

        public DbSet<BienTheSanPham> BienTheSanPhams => Set<BienTheSanPham>();

        // =====================================================
        // 4. HINH ANH SAN PHAM
        // =====================================================

        public DbSet<AnhSanPham> AnhSanPhams => Set<AnhSanPham>();

        // =====================================================
        // 5. GIO HANG
        // =====================================================

        public DbSet<GioHang> GioHangs => Set<GioHang>();

        public DbSet<GioHangChiTiet> GioHangChiTiets => Set<GioHangChiTiet>();

        // =====================================================
        // 6. KHUYEN MAI VA DON HANG
        // =====================================================

        public DbSet<MaGiamGia> MaGiamGias => Set<MaGiamGia>();

        public DbSet<DonHang> DonHangs => Set<DonHang>();

        public DbSet<ChiTietDonHang> ChiTietDonHangs => Set<ChiTietDonHang>();

        // =====================================================
        // 7. THANH TOAN VA VAN CHUYEN
        // =====================================================

        public DbSet<ThanhToan> ThanhToans => Set<ThanhToan>();

        public DbSet<VanChuyen> VanChuyens => Set<VanChuyen>();

        // =====================================================
        // 12. LICH SU DON HANG VA TON KHO
        // =====================================================

        public DbSet<LichSuTrangThaiDonHang> LichSuTrangThaiDonHangs => Set<LichSuTrangThaiDonHang>();

        public DbSet<LichSuTonKho> LichSuTonKhos => Set<LichSuTonKho>();

        // =====================================================
        // 13. YEU THICH VA DANH GIA
        // =====================================================

        public DbSet<SanPhamYeuThich> SanPhamYeuThiches => Set<SanPhamYeuThich>();

        public DbSet<DanhGiaSanPham> DanhGiaSanPhams => Set<DanhGiaSanPham>();

        // =====================================================
        // 14. LICH SU KHUYEN MAI VA NHAT KY QUAN TRI
        // =====================================================

        public DbSet<LichSuSuDungMaGiamGia> LichSuSuDungMaGiamGias => Set<LichSuSuDungMaGiamGia>();

        public DbSet<NhatKyQuanTri> NhatKyQuanTris => Set<NhatKyQuanTri>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =====================================================
            // BANG: vai_tro
            // =====================================================

            modelBuilder.Entity<VaiTro>(entity =>
            {
                entity.ToTable("vai_tro");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.Ma)
                    .HasColumnName("ma")
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(x => x.Ten)
                    .HasColumnName("ten")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(x => x.MoTa)
                    .HasColumnName("mo_ta")
                    .HasColumnType("text");

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                // SQL co UNIQUE tren ma. Dung unique index de van cho phep
                // thay doi ma vai tro khi entity dang duoc track.
                entity.HasIndex(x => x.Ma)
                    .IsUnique()
                    .HasDatabaseName("vai_tro_ma_key");
            });

            // =====================================================
            // BANG: nguoi_dung
            // =====================================================

            modelBuilder.Entity<NguoiDung>(entity =>
            {
                entity.ToTable("nguoi_dung");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.HoTen)
                    .HasColumnName("ho_ten")
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(x => x.Email)
                    .HasColumnName("email")
                    .HasMaxLength(320)
                    .IsRequired();

                entity.Property(x => x.MatKhauHash)
                    .HasColumnName("mat_khau_hash")
                    .HasColumnType("text")
                    .IsRequired();

                entity.Property(x => x.SoDienThoai)
                    .HasColumnName("so_dien_thoai")
                    .HasMaxLength(30);

                entity.Property(x => x.EmailDaXacMinh)
                    .HasColumnName("email_da_xac_minh")
                    .HasDefaultValue(false);

                entity.Property(x => x.DangHoatDong)
                    .HasColumnName("dang_hoat_dong")
                    .HasDefaultValue(true);

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(x => x.NgayCapNhat)
                    .HasColumnName("ngay_cap_nhat")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                // SQL co expression index: LOWER(email).
                // Khong khai bao unique index tren Email thong thuong o EF.
                // Index nay da ton tai va duoc quan ly trong SQL script.
            });

            // =====================================================
            // BANG: nguoi_dung_vai_tro
            // KHOA CHINH KEP (nguoi_dung_id, vai_tro_id)
            // =====================================================

            modelBuilder.Entity<NguoiDungVaiTro>(entity =>
            {
                entity.ToTable("nguoi_dung_vai_tro");

                entity.HasKey(x => new
                {
                    x.NguoiDungId,
                    x.VaiTroId
                });

                entity.Property(x => x.NguoiDungId)
                    .HasColumnName("nguoi_dung_id");

                entity.Property(x => x.VaiTroId)
                    .HasColumnName("vai_tro_id");

                entity.Property(x => x.NgayGan)
                    .HasColumnName("ngay_gan")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasOne(x => x.NguoiDung)
                    .WithMany(x => x.NguoiDungVaiTros)
                    .HasForeignKey(x => x.NguoiDungId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.VaiTro)
                    .WithMany(x => x.NguoiDungVaiTros)
                    .HasForeignKey(x => x.VaiTroId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // =====================================================
            // BANG: phien_dang_nhap
            // =====================================================

            modelBuilder.Entity<PhienDangNhap>(entity =>
            {
                entity.ToTable("phien_dang_nhap");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.NguoiDungId)
                    .HasColumnName("nguoi_dung_id");

                entity.Property(x => x.RefreshTokenHash)
                    .HasColumnName("refresh_token_hash")
                    .HasColumnType("character(64)")
                    .HasMaxLength(64)
                    .IsRequired();

                entity.Property(x => x.ThayTheBoiHash)
                    .HasColumnName("thay_the_boi_hash")
                    .HasColumnType("character(64)")
                    .HasMaxLength(64);

                entity.Property(x => x.ThietBi)
                    .HasColumnName("thiet_bi")
                    .HasMaxLength(250);

                entity.Property(x => x.DiaChiIp)
                    .HasColumnName("dia_chi_ip")
                    .HasColumnType("inet");

                entity.Property(x => x.HetHanLuc)
                    .HasColumnName("het_han_luc")
                    .HasColumnType("timestamp with time zone");

                entity.Property(x => x.DaThuHoiLuc)
                    .HasColumnName("da_thu_hoi_luc")
                    .HasColumnType("timestamp with time zone");

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                // SQL co UNIQUE tren refresh_token_hash.
                // Unique index cho phep cap nhat hash khi xoay refresh token.
                entity.HasIndex(x => x.RefreshTokenHash)
                    .IsUnique()
                    .HasDatabaseName("phien_dang_nhap_refresh_token_hash_key");

                entity.HasIndex(x => new
                {
                    x.NguoiDungId,
                    x.HetHanLuc
                })
                .IsDescending(false, true)
                .HasDatabaseName("ix_phien_dang_nhap_nguoi_dung");

                entity.HasOne(x => x.NguoiDung)
                    .WithMany(x => x.PhienDangNhaps)
                    .HasForeignKey(x => x.NguoiDungId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // =====================================================
            // BANG: dia_chi_giao_hang
            // =====================================================

            modelBuilder.Entity<DiaChiGiaoHang>(entity =>
            {
                entity.ToTable("dia_chi_giao_hang");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.NguoiDungId)
                    .HasColumnName("nguoi_dung_id");

                entity.Property(x => x.TenNguoiNhan)
                    .HasColumnName("ten_nguoi_nhan")
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(x => x.SoDienThoai)
                    .HasColumnName("so_dien_thoai")
                    .HasMaxLength(30)
                    .IsRequired();

                entity.Property(x => x.TinhThanh)
                    .HasColumnName("tinh_thanh")
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(x => x.QuanHuyen)
                    .HasColumnName("quan_huyen")
                    .HasMaxLength(150);

                entity.Property(x => x.PhuongXa)
                    .HasColumnName("phuong_xa")
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(x => x.DiaChiChiTiet)
                    .HasColumnName("dia_chi_chi_tiet")
                    .HasMaxLength(300)
                    .IsRequired();

                entity.Property(x => x.LaMacDinh)
                    .HasColumnName("la_mac_dinh")
                    .HasDefaultValue(false);

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(x => x.NgayCapNhat)
                    .HasColumnName("ngay_cap_nhat")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasOne(x => x.NguoiDung)
                    .WithMany(x => x.DiaChiGiaoHangs)
                    .HasForeignKey(x => x.NguoiDungId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(x => x.NguoiDungId)
                    .HasDatabaseName("ix_dia_chi_nguoi_dung");

                entity.HasIndex(x => x.NguoiDungId)
                    .IsUnique()
                    .HasFilter("la_mac_dinh = TRUE")
                    .HasDatabaseName("ux_dia_chi_mac_dinh");
            });

            // =====================================================
            // BANG: danh_muc
            // =====================================================

            modelBuilder.Entity<DanhMuc>(entity =>
            {
                entity.ToTable("danh_muc", table =>
                {
                    table.HasCheckConstraint(
                        "ck_danh_muc_khong_tu_lam_cha",
                        "danh_muc_cha_id IS NULL OR danh_muc_cha_id <> id");
                });

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.DanhMucChaId)
                    .HasColumnName("danh_muc_cha_id");

                entity.Property(x => x.Ten)
                    .HasColumnName("ten")
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(x => x.Slug)
                    .HasColumnName("slug")
                    .HasMaxLength(180)
                    .IsRequired();

                entity.Property(x => x.MoTa)
                    .HasColumnName("mo_ta")
                    .HasColumnType("text");

                entity.Property(x => x.ThuTuHienThi)
                    .HasColumnName("thu_tu_hien_thi")
                    .HasDefaultValue(0);

                entity.Property(x => x.DangHoatDong)
                    .HasColumnName("dang_hoat_dong")
                    .HasDefaultValue(true);

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(x => x.NgayCapNhat)
                    .HasColumnName("ngay_cap_nhat")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasIndex(x => x.Slug)
                    .IsUnique()
                    .HasDatabaseName("danh_muc_slug_key");

                entity.HasIndex(x => x.DanhMucChaId)
                    .HasDatabaseName("ix_danh_muc_cha");

                entity.HasOne(x => x.DanhMucCha)
                    .WithMany(x => x.DanhMucCon)
                    .HasForeignKey(x => x.DanhMucChaId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // =====================================================
            // BANG: thuong_hieu
            // =====================================================

            modelBuilder.Entity<ThuongHieu>(entity =>
            {
                entity.ToTable("thuong_hieu");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.Ten)
                    .HasColumnName("ten")
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(x => x.Slug)
                    .HasColumnName("slug")
                    .HasMaxLength(180)
                    .IsRequired();

                entity.Property(x => x.MoTa)
                    .HasColumnName("mo_ta")
                    .HasColumnType("text");

                entity.Property(x => x.DuongDanLogo)
                    .HasColumnName("duong_dan_logo")
                    .HasMaxLength(800);

                entity.Property(x => x.DangHoatDong)
                    .HasColumnName("dang_hoat_dong")
                    .HasDefaultValue(true);

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(x => x.NgayCapNhat)
                    .HasColumnName("ngay_cap_nhat")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasIndex(x => x.Slug)
                    .IsUnique()
                    .HasDatabaseName("thuong_hieu_slug_key");
            });

            // =====================================================
            // BANG: kich_co
            // =====================================================

            modelBuilder.Entity<KichCo>(entity =>
            {
                entity.ToTable("kich_co");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.Ma)
                    .HasColumnName("ma")
                    .HasMaxLength(30)
                    .IsRequired();

                entity.Property(x => x.TenHienThi)
                    .HasColumnName("ten_hien_thi")
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(x => x.ThuTuHienThi)
                    .HasColumnName("thu_tu_hien_thi")
                    .HasDefaultValue(0);

                entity.Property(x => x.DangHoatDong)
                    .HasColumnName("dang_hoat_dong")
                    .HasDefaultValue(true);

                entity.HasIndex(x => x.Ma)
                    .IsUnique()
                    .HasDatabaseName("kich_co_ma_key");
            });

            // =====================================================
            // BANG: mau_sac
            // =====================================================

            modelBuilder.Entity<MauSac>(entity =>
            {
                entity.ToTable("mau_sac", table =>
                {
                    table.HasCheckConstraint(
                        "ck_mau_sac_ma_hex",
                        "ma_hex IS NULL OR ma_hex ~ '^#[0-9A-Fa-f]{6}$'");
                });

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.Ten)
                    .HasColumnName("ten")
                    .HasMaxLength(80)
                    .IsRequired();

                entity.Property(x => x.MaHex)
                    .HasColumnName("ma_hex")
                    .HasMaxLength(7);

                entity.Property(x => x.ThuTuHienThi)
                    .HasColumnName("thu_tu_hien_thi")
                    .HasDefaultValue(0);

                entity.Property(x => x.DangHoatDong)
                    .HasColumnName("dang_hoat_dong")
                    .HasDefaultValue(true);

                // SQL co expression index: LOWER(ten).
                // Khong tao unique index thong thuong tren Ten.
            });

            // =====================================================
            // BANG: san_pham
            // =====================================================

            modelBuilder.Entity<SanPham>(entity =>
            {
                entity.ToTable("san_pham", table =>
                {
                    table.HasCheckConstraint(
                        "ck_san_pham_doi_tuong",
                        "doi_tuong IS NULL OR doi_tuong IN ('nam', 'nu', 'unisex', 'tre_em', 'khac')");

                    table.HasCheckConstraint(
                        "ck_san_pham_trang_thai",
                        "trang_thai IN ('nhap', 'dang_ban', 'an', 'ngung_kinh_doanh')");
                });

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.DanhMucId)
                    .HasColumnName("danh_muc_id");

                entity.Property(x => x.ThuongHieuId)
                    .HasColumnName("thuong_hieu_id");

                entity.Property(x => x.Ten)
                    .HasColumnName("ten")
                    .HasMaxLength(250)
                    .IsRequired();

                entity.Property(x => x.Slug)
                    .HasColumnName("slug")
                    .HasMaxLength(280)
                    .IsRequired();

                entity.Property(x => x.MoTa)
                    .HasColumnName("mo_ta")
                    .HasColumnType("text");

                entity.Property(x => x.ChatLieu)
                    .HasColumnName("chat_lieu")
                    .HasMaxLength(200);

                entity.Property(x => x.DoiTuong)
                    .HasColumnName("doi_tuong")
                    .HasMaxLength(30);

                entity.Property(x => x.TrangThai)
                    .HasColumnName("trang_thai")
                    .HasMaxLength(30)
                    .HasDefaultValue("nhap");

                entity.Property(x => x.NoiBat)
                    .HasColumnName("noi_bat")
                    .HasDefaultValue(false);

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(x => x.NgayCapNhat)
                    .HasColumnName("ngay_cap_nhat")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasIndex(x => x.Slug)
                    .IsUnique()
                    .HasDatabaseName("san_pham_slug_key");

                entity.HasIndex(x => new
                {
                    x.DanhMucId,
                    x.TrangThai
                })
                .HasDatabaseName("ix_san_pham_danh_muc_trang_thai");

                entity.HasIndex(x => x.ThuongHieuId)
                    .HasDatabaseName("ix_san_pham_thuong_hieu");

                entity.HasIndex(x => x.NgayTao)
                    .IsDescending()
                    .HasDatabaseName("ix_san_pham_ngay_tao");

                entity.HasIndex(x => x.NoiBat)
                    .HasFilter("noi_bat = TRUE AND trang_thai = 'dang_ban'")
                    .HasDatabaseName("ix_san_pham_noi_bat");

                entity.HasOne(x => x.DanhMuc)
                    .WithMany(x => x.SanPhams)
                    .HasForeignKey(x => x.DanhMucId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.ThuongHieu)
                    .WithMany(x => x.SanPhams)
                    .HasForeignKey(x => x.ThuongHieuId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // =====================================================
            // BANG: bien_the_san_pham
            // =====================================================

            modelBuilder.Entity<BienTheSanPham>(entity =>
            {
                entity.ToTable("bien_the_san_pham", table =>
                {
                    table.HasCheckConstraint(
                        "ck_bien_the_gia_ban",
                        "gia_ban >= 0");

                    table.HasCheckConstraint(
                        "ck_bien_the_gia_niem_yet",
                        "gia_niem_yet IS NULL OR gia_niem_yet >= gia_ban");

                    table.HasCheckConstraint(
                        "ck_bien_the_ton_kho",
                        "so_luong_ton >= 0");
                });

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.SanPhamId)
                    .HasColumnName("san_pham_id");

                entity.Property(x => x.KichCoId)
                    .HasColumnName("kich_co_id");

                entity.Property(x => x.MauSacId)
                    .HasColumnName("mau_sac_id");

                entity.Property(x => x.Sku)
                    .HasColumnName("sku")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(x => x.GiaBan)
                    .HasColumnName("gia_ban")
                    .HasPrecision(18, 2);

                entity.Property(x => x.GiaNiemYet)
                    .HasColumnName("gia_niem_yet")
                    .HasPrecision(18, 2);

                entity.Property(x => x.SoLuongTon)
                    .HasColumnName("so_luong_ton")
                    .HasDefaultValue(0);

                entity.Property(x => x.DangBan)
                    .HasColumnName("dang_ban")
                    .HasDefaultValue(true);

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(x => x.NgayCapNhat)
                    .HasColumnName("ngay_cap_nhat")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                // SQL co UNIQUE (id, san_pham_id).
                entity.HasAlternateKey(x => new
                {
                    x.Id,
                    x.SanPhamId
                })
                .HasName("uq_bien_the_id_san_pham");

                entity.HasIndex(x => x.SanPhamId)
                    .HasDatabaseName("ix_bien_the_san_pham");

                entity.HasIndex(x => x.GiaBan)
                    .HasFilter("dang_ban = TRUE")
                    .HasDatabaseName("ix_bien_the_loc_gia");

                // SQL quan ly cac unique index tren LOWER(sku) va cac to hop
                // size/mau co dieu kien NULL. Khong khai bao unique index thuong
                // tren Sku hoac (SanPhamId, KichCoId, MauSacId) tai day.

                entity.HasOne(x => x.SanPham)
                    .WithMany(x => x.BienTheSanPhams)
                    .HasForeignKey(x => x.SanPhamId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.KichCo)
                    .WithMany(x => x.BienTheSanPhams)
                    .HasForeignKey(x => x.KichCoId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.MauSac)
                    .WithMany(x => x.BienTheSanPhams)
                    .HasForeignKey(x => x.MauSacId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // =====================================================
            // BANG: anh_san_pham
            // =====================================================

            modelBuilder.Entity<AnhSanPham>(entity =>
            {
                entity.ToTable("anh_san_pham");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.SanPhamId)
                    .HasColumnName("san_pham_id");

                entity.Property(x => x.BienTheSanPhamId)
                    .HasColumnName("bien_the_san_pham_id");

                entity.Property(x => x.DuongDanLuuTru)
                    .HasColumnName("duong_dan_luu_tru")
                    .HasMaxLength(800)
                    .IsRequired();

                entity.Property(x => x.MoTaAnh)
                    .HasColumnName("mo_ta_anh")
                    .HasMaxLength(300);

                entity.Property(x => x.LaAnhChinh)
                    .HasColumnName("la_anh_chinh")
                    .HasDefaultValue(false);

                entity.Property(x => x.ThuTuHienThi)
                    .HasColumnName("thu_tu_hien_thi")
                    .HasDefaultValue(0);

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasIndex(x => x.SanPhamId)
                    .IsUnique()
                    .HasFilter("la_anh_chinh = TRUE")
                    .HasDatabaseName("ux_anh_san_pham_anh_chinh");

                entity.HasIndex(x => new
                {
                    x.SanPhamId,
                    x.ThuTuHienThi
                })
                .HasDatabaseName("ix_anh_san_pham_sap_xep");

                // SQL dinh nghia duong_dan_luu_tru UNIQUE.
                entity.HasIndex(x => x.DuongDanLuuTru)
                    .IsUnique()
                    .HasDatabaseName("anh_san_pham_duong_dan_luu_tru_key");

                entity.HasOne(x => x.SanPham)
                    .WithMany(x => x.AnhSanPhams)
                    .HasForeignKey(x => x.SanPhamId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.BienTheSanPham)
                    .WithMany(x => x.AnhSanPhams)
                    .HasForeignKey(x => x.BienTheSanPhamId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // =====================================================
            // 5-11. GIO HANG, KHUYEN MAI, DON HANG, THANH TOAN, VAN CHUYEN
            // =====================================================

            // =====================================================
            // 5. GIO HANG
            // =====================================================
            modelBuilder.Entity<GioHang>(entity =>
            {
                entity.ToTable("gio_hang");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.NguoiDungId)
                    .HasColumnName("nguoi_dung_id");

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(x => x.NgayCapNhat)
                    .HasColumnName("ngay_cap_nhat")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasIndex(x => x.NguoiDungId)
                    .IsUnique()
                    .HasDatabaseName("gio_hang_nguoi_dung_id_key");

                entity.HasOne(x => x.NguoiDung)
                    .WithOne(x => x.GioHang)
                    .HasForeignKey<GioHang>(x => x.NguoiDungId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // =====================================================
            // 6. CHI TIET GIO HANG
            // =====================================================
            modelBuilder.Entity<GioHangChiTiet>(entity =>
            {
                entity.ToTable("gio_hang_chi_tiet", table =>
                {
                    table.HasCheckConstraint(
                        "ck_gio_hang_so_luong",
                        "so_luong > 0"
                    );
                });

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.GioHangId)
                    .HasColumnName("gio_hang_id");

                entity.Property(x => x.BienTheSanPhamId)
                    .HasColumnName("bien_the_san_pham_id");

                entity.Property(x => x.SoLuong)
                    .HasColumnName("so_luong");

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(x => x.NgayCapNhat)
                    .HasColumnName("ngay_cap_nhat")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasIndex(x => new { x.GioHangId, x.BienTheSanPhamId })
                    .IsUnique()
                    .HasDatabaseName("uq_gio_hang_bien_the");

                entity.HasIndex(x => x.GioHangId)
                    .HasDatabaseName("ix_gio_hang_chi_tiet_gio_hang");

                entity.HasOne(x => x.GioHang)
                    .WithMany(x => x.GioHangChiTiets)
                    .HasForeignKey(x => x.GioHangId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.BienTheSanPham)
                    .WithMany(x => x.GioHangChiTiets)
                    .HasForeignKey(x => x.BienTheSanPhamId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // =====================================================
            // 7. MA GIAM GIA
            // =====================================================
            modelBuilder.Entity<MaGiamGia>(entity =>
            {
                entity.ToTable("ma_giam_gia", table =>
                {
                    table.HasCheckConstraint(
                        "ck_ma_giam_gia_loai",
                        "loai_giam_gia IN ('phan_tram', 'so_tien')"
                    );
                    table.HasCheckConstraint(
                        "ck_ma_giam_gia_gia_tri",
                        "gia_tri > 0"
                    );
                    table.HasCheckConstraint(
                        "ck_ma_giam_gia_toi_thieu",
                        "don_hang_toi_thieu >= 0"
                    );
                    table.HasCheckConstraint(
                        "ck_ma_giam_gia_toi_da",
                        "tien_giam_toi_da IS NULL OR tien_giam_toi_da >= 0"
                    );
                    table.HasCheckConstraint(
                        "ck_ma_giam_gia_so_luot",
                        "(so_luot_su_dung_toi_da IS NULL OR so_luot_su_dung_toi_da > 0) " +
                        "AND so_luot_da_su_dung >= 0 AND moi_nguoi_su_dung_toi_da > 0"
                    );
                    table.HasCheckConstraint(
                        "ck_ma_giam_gia_thoi_gian",
                        "ket_thuc_luc > bat_dau_luc"
                    );
                    table.HasCheckConstraint(
                        "ck_ma_giam_gia_phan_tram",
                        "loai_giam_gia <> 'phan_tram' OR gia_tri <= 100"
                    );
                });

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.Ma)
                    .HasColumnName("ma")
                    .HasMaxLength(80)
                    .IsRequired();

                entity.Property(x => x.Ten)
                    .HasColumnName("ten")
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(x => x.LoaiGiamGia)
                    .HasColumnName("loai_giam_gia")
                    .HasMaxLength(20)
                    .IsRequired();

                entity.Property(x => x.GiaTri)
                    .HasColumnName("gia_tri")
                    .HasPrecision(18, 2);

                entity.Property(x => x.DonHangToiThieu)
                    .HasColumnName("don_hang_toi_thieu")
                    .HasPrecision(18, 2)
                    .HasDefaultValue(0m);

                entity.Property(x => x.TienGiamToiDa)
                    .HasColumnName("tien_giam_toi_da")
                    .HasPrecision(18, 2);

                entity.Property(x => x.SoLuotSuDungToiDa)
                    .HasColumnName("so_luot_su_dung_toi_da");

                entity.Property(x => x.SoLuotDaSuDung)
                    .HasColumnName("so_luot_da_su_dung")
                    .HasDefaultValue(0);

                entity.Property(x => x.MoiNguoiSuDungToiDa)
                    .HasColumnName("moi_nguoi_su_dung_toi_da")
                    .HasDefaultValue(1);

                entity.Property(x => x.BatDauLuc)
                    .HasColumnName("bat_dau_luc")
                    .HasColumnType("timestamp with time zone");

                entity.Property(x => x.KetThucLuc)
                    .HasColumnName("ket_thuc_luc")
                    .HasColumnType("timestamp with time zone");

                entity.Property(x => x.DangHoatDong)
                    .HasColumnName("dang_hoat_dong")
                    .HasDefaultValue(true);

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(x => x.NgayCapNhat)
                    .HasColumnName("ngay_cap_nhat")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                // SQL dung unique index tren LOWER(ma), khong tao unique index thuong o EF.
            });

            // =====================================================
            // 8. DON HANG
            // =====================================================
            modelBuilder.Entity<DonHang>(entity =>
            {
                entity.ToTable("don_hang", table =>
                {
                    table.HasCheckConstraint(
                        "ck_don_hang_trang_thai",
                        "trang_thai IN ('cho_xac_nhan', 'da_xac_nhan', 'dang_chuan_bi', 'dang_giao', 'da_giao', 'da_huy')"
                    );
                    table.HasCheckConstraint(
                        "ck_don_hang_thanh_toan",
                        "trang_thai_thanh_toan IN ('cho_thanh_toan', 'da_thanh_toan', 'that_bai', 'da_hoan_tien', 'hoan_tien_mot_phan')"
                    );
                    table.HasCheckConstraint(
                        "ck_don_hang_phuong_thuc",
                        "phuong_thuc_thanh_toan IN ('cod', 'chuyen_khoan', 'cong_thanh_toan')"
                    );
                    table.HasCheckConstraint(
                        "ck_don_hang_tien_te",
                        "tien_te = 'VND'"
                    );
                    table.HasCheckConstraint(
                        "ck_don_hang_tien",
                        "tong_tien_hang >= 0 AND tien_giam_gia >= 0 " +
                        "AND tien_giam_gia <= tong_tien_hang AND phi_van_chuyen >= 0 " +
                        "AND tong_thanh_toan = tong_tien_hang - tien_giam_gia + phi_van_chuyen"
                    );
                });

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.MaDonHang)
                    .HasColumnName("ma_don_hang")
                    .HasMaxLength(60)
                    .IsRequired();

                entity.Property(x => x.NguoiDungId)
                    .HasColumnName("nguoi_dung_id");

                entity.Property(x => x.MaGiamGiaId)
                    .HasColumnName("ma_giam_gia_id");

                entity.Property(x => x.MaGiamGiaDaApDung)
                    .HasColumnName("ma_giam_gia_da_ap_dung")
                    .HasMaxLength(80);

                entity.Property(x => x.TrangThai)
                    .HasColumnName("trang_thai")
                    .HasMaxLength(30)
                    .HasDefaultValue("cho_xac_nhan");

                entity.Property(x => x.TrangThaiThanhToan)
                    .HasColumnName("trang_thai_thanh_toan")
                    .HasMaxLength(30)
                    .HasDefaultValue("cho_thanh_toan");

                entity.Property(x => x.PhuongThucThanhToan)
                    .HasColumnName("phuong_thuc_thanh_toan")
                    .HasMaxLength(30)
                    .HasDefaultValue("cod");

                entity.Property(x => x.TongTienHang)
                    .HasColumnName("tong_tien_hang")
                    .HasPrecision(18, 2);

                entity.Property(x => x.TienGiamGia)
                    .HasColumnName("tien_giam_gia")
                    .HasPrecision(18, 2)
                    .HasDefaultValue(0m);

                entity.Property(x => x.PhiVanChuyen)
                    .HasColumnName("phi_van_chuyen")
                    .HasPrecision(18, 2)
                    .HasDefaultValue(0m);

                entity.Property(x => x.TongThanhToan)
                    .HasColumnName("tong_thanh_toan")
                    .HasPrecision(18, 2);

                entity.Property(x => x.TienTe)
                    .HasColumnName("tien_te")
                    .HasMaxLength(3)
                    .HasDefaultValue("VND");

                entity.Property(x => x.TenNguoiNhan)
                    .HasColumnName("ten_nguoi_nhan")
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(x => x.SoDienThoaiNhan)
                    .HasColumnName("so_dien_thoai_nhan")
                    .HasMaxLength(30)
                    .IsRequired();

                entity.Property(x => x.TinhThanhNhan)
                    .HasColumnName("tinh_thanh_nhan")
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(x => x.QuanHuyenNhan)
                    .HasColumnName("quan_huyen_nhan")
                    .HasMaxLength(150);

                entity.Property(x => x.PhuongXaNhan)
                    .HasColumnName("phuong_xa_nhan")
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(x => x.DiaChiChiTietNhan)
                    .HasColumnName("dia_chi_chi_tiet_nhan")
                    .HasMaxLength(300)
                    .IsRequired();

                entity.Property(x => x.GhiChuKhachHang)
                    .HasColumnName("ghi_chu_khach_hang");

                entity.Property(x => x.LyDoHuy)
                    .HasColumnName("ly_do_huy");

                entity.Property(x => x.KhoaIdempotent)
                    .HasColumnName("khoa_idempotent");

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(x => x.NgayCapNhat)
                    .HasColumnName("ngay_cap_nhat")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasIndex(x => x.MaDonHang)
                    .IsUnique()
                    .HasDatabaseName("don_hang_ma_don_hang_key");

                entity.HasIndex(x => new { x.NguoiDungId, x.KhoaIdempotent })
                    .IsUnique()
                    .HasFilter("khoa_idempotent IS NOT NULL")
                    .HasDatabaseName("ux_don_hang_idempotent");

                entity.HasIndex(x => new { x.NguoiDungId, x.NgayTao })
                    .IsDescending(false, true)
                    .HasDatabaseName("ix_don_hang_nguoi_dung_ngay_tao");

                entity.HasIndex(x => new { x.TrangThai, x.NgayTao })
                    .IsDescending(false, true)
                    .HasDatabaseName("ix_don_hang_trang_thai_ngay_tao");

                entity.HasOne(x => x.NguoiDung)
                    .WithMany(x => x.DonHangs)
                    .HasForeignKey(x => x.NguoiDungId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.MaGiamGia)
                    .WithMany(x => x.DonHangs)
                    .HasForeignKey(x => x.MaGiamGiaId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // =====================================================
            // 9. CHI TIET DON HANG
            // =====================================================
            modelBuilder.Entity<ChiTietDonHang>(entity =>
            {
                entity.ToTable("chi_tiet_don_hang", table =>
                {
                    table.HasCheckConstraint(
                        "ck_chi_tiet_don_hang_so_luong",
                        "so_luong > 0"
                    );
                    table.HasCheckConstraint(
                        "ck_chi_tiet_don_hang_tien",
                        "don_gia >= 0 AND tien_giam_gia >= 0 " +
                        "AND tien_giam_gia <= so_luong * don_gia " +
                        "AND thanh_tien = so_luong * don_gia - tien_giam_gia"
                    );
                });

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.DonHangId)
                    .HasColumnName("don_hang_id");

                entity.Property(x => x.SanPhamId)
                    .HasColumnName("san_pham_id");

                entity.Property(x => x.BienTheSanPhamId)
                    .HasColumnName("bien_the_san_pham_id");

                entity.Property(x => x.TenSanPham)
                    .HasColumnName("ten_san_pham")
                    .HasMaxLength(250)
                    .IsRequired();

                entity.Property(x => x.Sku)
                    .HasColumnName("sku")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(x => x.TenKichCo)
                    .HasColumnName("ten_kich_co")
                    .HasMaxLength(50);

                entity.Property(x => x.TenMauSac)
                    .HasColumnName("ten_mau_sac")
                    .HasMaxLength(80);

                entity.Property(x => x.SoLuong)
                    .HasColumnName("so_luong");

                entity.Property(x => x.DonGia)
                    .HasColumnName("don_gia")
                    .HasPrecision(18, 2);

                entity.Property(x => x.TienGiamGia)
                    .HasColumnName("tien_giam_gia")
                    .HasPrecision(18, 2)
                    .HasDefaultValue(0m);

                entity.Property(x => x.ThanhTien)
                    .HasColumnName("thanh_tien")
                    .HasPrecision(18, 2);

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasIndex(x => x.DonHangId)
                    .HasDatabaseName("ix_chi_tiet_don_hang_don_hang");

                entity.HasOne(x => x.DonHang)
                    .WithMany(x => x.ChiTietDonHangs)
                    .HasForeignKey(x => x.DonHangId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.SanPham)
                    .WithMany(x => x.ChiTietDonHangs)
                    .HasForeignKey(x => x.SanPhamId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(x => x.BienTheSanPham)
                    .WithMany(x => x.ChiTietDonHangs)
                    .HasForeignKey(x => x.BienTheSanPhamId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // =====================================================
            // 10. THANH TOAN
            // =====================================================
            modelBuilder.Entity<ThanhToan>(entity =>
            {
                entity.ToTable("thanh_toan", table =>
                {
                    table.HasCheckConstraint(
                        "ck_thanh_toan_so_tien",
                        "so_tien >= 0"
                    );
                    table.HasCheckConstraint(
                        "ck_thanh_toan_trang_thai",
                        "trang_thai IN ('cho_thanh_toan', 'dang_xu_ly', 'thanh_cong', 'that_bai', 'da_hoan_tien')"
                    );
                });

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.DonHangId)
                    .HasColumnName("don_hang_id");

                entity.Property(x => x.CongThanhToan)
                    .HasColumnName("cong_thanh_toan")
                    .HasMaxLength(80);

                entity.Property(x => x.PhuongThuc)
                    .HasColumnName("phuong_thuc")
                    .HasMaxLength(30)
                    .IsRequired();

                entity.Property(x => x.SoTien)
                    .HasColumnName("so_tien")
                    .HasPrecision(18, 2);

                entity.Property(x => x.TienTe)
                    .HasColumnName("tien_te")
                    .HasMaxLength(3)
                    .HasDefaultValue("VND");

                entity.Property(x => x.TrangThai)
                    .HasColumnName("trang_thai")
                    .HasMaxLength(30)
                    .HasDefaultValue("cho_thanh_toan");

                entity.Property(x => x.MaGiaoDichNhaCungCap)
                    .HasColumnName("ma_giao_dich_nha_cung_cap")
                    .HasMaxLength(200);

                entity.Property(x => x.KhoaIdempotent)
                    .HasColumnName("khoa_idempotent")
                    .HasMaxLength(200);

                entity.Property(x => x.ThoiDiemThanhToan)
                    .HasColumnName("thoi_diem_thanh_toan")
                    .HasColumnType("timestamp with time zone");

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(x => x.NgayCapNhat)
                    .HasColumnName("ngay_cap_nhat")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasIndex(x => x.DonHangId)
                    .HasDatabaseName("ix_thanh_toan_don_hang");

                entity.HasIndex(x => x.KhoaIdempotent)
                    .IsUnique()
                    .HasFilter("khoa_idempotent IS NOT NULL")
                    .HasDatabaseName("ux_thanh_toan_idempotent");

                entity.HasIndex(x => new { x.CongThanhToan, x.MaGiaoDichNhaCungCap })
                    .IsUnique()
                    .HasFilter("ma_giao_dich_nha_cung_cap IS NOT NULL")
                    .HasDatabaseName("ux_thanh_toan_ma_giao_dich");

                entity.HasOne(x => x.DonHang)
                    .WithMany(x => x.ThanhToans)
                    .HasForeignKey(x => x.DonHangId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // =====================================================
            // 11. VAN CHUYEN
            // =====================================================
            modelBuilder.Entity<VanChuyen>(entity =>
            {
                entity.ToTable("van_chuyen", table =>
                {
                    table.HasCheckConstraint(
                        "ck_van_chuyen_trang_thai",
                        "trang_thai IN ('cho_xu_ly', 'da_lay_hang', 'dang_giao', 'da_giao', 'giao_that_bai', 'da_huy')"
                    );
                });

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.DonHangId)
                    .HasColumnName("don_hang_id");

                entity.Property(x => x.DonViVanChuyen)
                    .HasColumnName("don_vi_van_chuyen")
                    .HasMaxLength(150);

                entity.Property(x => x.MaVanDon)
                    .HasColumnName("ma_van_don")
                    .HasMaxLength(150);

                entity.Property(x => x.TrangThai)
                    .HasColumnName("trang_thai")
                    .HasMaxLength(30)
                    .HasDefaultValue("cho_xu_ly");

                entity.Property(x => x.ThoiDiemGuiHang)
                    .HasColumnName("thoi_diem_gui_hang")
                    .HasColumnType("timestamp with time zone");

                entity.Property(x => x.ThoiDiemGiaoHang)
                    .HasColumnName("thoi_diem_giao_hang")
                    .HasColumnType("timestamp with time zone");

                entity.Property(x => x.GhiChu)
                    .HasColumnName("ghi_chu");

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(x => x.NgayCapNhat)
                    .HasColumnName("ngay_cap_nhat")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasIndex(x => x.DonHangId)
                    .IsUnique()
                    .HasDatabaseName("van_chuyen_don_hang_id_key");

                entity.HasOne(x => x.DonHang)
                    .WithOne(x => x.VanChuyen)
                    .HasForeignKey<VanChuyen>(x => x.DonHangId)
                    .OnDelete(DeleteBehavior.Restrict);
            });


            // =====================================================
            // 12. LICH SU TRANG THAI DON HANG
            // =====================================================
            modelBuilder.Entity<LichSuTrangThaiDonHang>(entity =>
            {
                entity.ToTable("lich_su_trang_thai_don_hang");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.DonHangId)
                    .HasColumnName("don_hang_id");

                entity.Property(x => x.TrangThaiCu)
                    .HasColumnName("trang_thai_cu")
                    .HasMaxLength(30);

                entity.Property(x => x.TrangThaiMoi)
                    .HasColumnName("trang_thai_moi")
                    .HasMaxLength(30)
                    .IsRequired();

                entity.Property(x => x.NguoiThucHienId)
                    .HasColumnName("nguoi_thuc_hien_id");

                entity.Property(x => x.GhiChu)
                    .HasColumnName("ghi_chu")
                    .HasColumnType("text");

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasIndex(x => new { x.DonHangId, x.NgayTao })
                    .IsDescending(false, true)
                    .HasDatabaseName("ix_lich_su_trang_thai_don_hang");

                entity.HasOne(x => x.DonHang)
                    .WithMany(x => x.LichSuTrangThaiDonHangs)
                    .HasForeignKey(x => x.DonHangId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.NguoiThucHien)
                    .WithMany(x => x.LichSuTrangThaiDonHangs)
                    .HasForeignKey(x => x.NguoiThucHienId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // =====================================================
            // 13. LICH SU TON KHO
            // =====================================================
            modelBuilder.Entity<LichSuTonKho>(entity =>
            {
                entity.ToTable("lich_su_ton_kho", table =>
                {
                    table.HasCheckConstraint(
                        "ck_lich_su_ton_kho_so_luong",
                        "so_luong_thay_doi <> 0"
                    );

                    table.HasCheckConstraint(
                        "ck_lich_su_ton_kho_loai",
                        "loai_giao_dich IN ('nhap_hang', 'xuat_hang', 'dat_hang', 'huy_don', 'dieu_chinh', 'hoan_hang', 'khac')"
                    );
                });

            entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.BienTheSanPhamId)
                    .HasColumnName("bien_the_san_pham_id");

                entity.Property(x => x.DonHangId)
                    .HasColumnName("don_hang_id");

                entity.Property(x => x.NguoiThucHienId)
                    .HasColumnName("nguoi_thuc_hien_id");

                entity.Property(x => x.SoLuongThayDoi)
                    .HasColumnName("so_luong_thay_doi");

                entity.Property(x => x.LoaiGiaoDich)
                    .HasColumnName("loai_giao_dich")
                    .HasMaxLength(30)
                    .IsRequired();

                entity.Property(x => x.GhiChu)
                    .HasColumnName("ghi_chu")
                    .HasColumnType("text");

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasIndex(x => new { x.BienTheSanPhamId, x.NgayTao })
                    .IsDescending(false, true)
                    .HasDatabaseName("ix_lich_su_ton_kho_bien_the");

                entity.HasIndex(x => x.DonHangId)
                    .HasFilter("don_hang_id IS NOT NULL")
                    .HasDatabaseName("ix_lich_su_ton_kho_don_hang");

                entity.HasOne(x => x.BienTheSanPham)
                    .WithMany(x => x.LichSuTonKhos)
                    .HasForeignKey(x => x.BienTheSanPhamId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.DonHang)
                    .WithMany(x => x.LichSuTonKhos)
                    .HasForeignKey(x => x.DonHangId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(x => x.NguoiThucHien)
                    .WithMany(x => x.LichSuTonKhos)
                    .HasForeignKey(x => x.NguoiThucHienId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // =====================================================
            // 14. SAN PHAM YEU THICH
            // =====================================================
            modelBuilder.Entity<SanPhamYeuThich>(entity =>
            {
                entity.ToTable("san_pham_yeu_thich");

                entity.HasKey(x => new { x.NguoiDungId, x.SanPhamId });

                entity.Property(x => x.NguoiDungId)
                    .HasColumnName("nguoi_dung_id");

                entity.Property(x => x.SanPhamId)
                    .HasColumnName("san_pham_id");

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasOne(x => x.NguoiDung)
                    .WithMany(x => x.SanPhamYeuThiches)
                    .HasForeignKey(x => x.NguoiDungId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.SanPham)
                    .WithMany(x => x.SanPhamYeuThiches)
                    .HasForeignKey(x => x.SanPhamId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // =====================================================
            // 15. DANH GIA SAN PHAM
            // =====================================================
            modelBuilder.Entity<DanhGiaSanPham>(entity =>
            {
                entity.ToTable("danh_gia_san_pham", table =>
                {
                    table.HasCheckConstraint(
                        "ck_danh_gia_so_sao",
                        "so_sao BETWEEN 1 AND 5"
                    );

                    table.HasCheckConstraint(
                        "ck_danh_gia_trang_thai",
                        "trang_thai IN ('cho_duyet', 'hien_thi', 'an')"
                    );
                });

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.NguoiDungId)
                    .HasColumnName("nguoi_dung_id");

                entity.Property(x => x.SanPhamId)
                    .HasColumnName("san_pham_id");

                entity.Property(x => x.ChiTietDonHangId)
                    .HasColumnName("chi_tiet_don_hang_id");

                entity.Property(x => x.SoSao)
                    .HasColumnName("so_sao")
                    .HasColumnType("smallint");

                entity.Property(x => x.NoiDung)
                    .HasColumnName("noi_dung")
                    .HasColumnType("text");

                entity.Property(x => x.TrangThai)
                    .HasColumnName("trang_thai")
                    .HasMaxLength(20)
                    .HasDefaultValue("cho_duyet");

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(x => x.NgayCapNhat)
                    .HasColumnName("ngay_cap_nhat")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasIndex(x => new { x.NguoiDungId, x.SanPhamId })
                    .IsUnique()
                    .HasDatabaseName("uq_danh_gia_nguoi_dung_san_pham");

                entity.HasIndex(x => new { x.SanPhamId, x.TrangThai, x.NgayTao })
                    .IsDescending(false, false, true)
                    .HasDatabaseName("ix_danh_gia_san_pham");

                entity.HasOne(x => x.NguoiDung)
                    .WithMany(x => x.DanhGiaSanPhams)
                    .HasForeignKey(x => x.NguoiDungId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.SanPham)
                    .WithMany(x => x.DanhGiaSanPhams)
                    .HasForeignKey(x => x.SanPhamId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.ChiTietDonHang)
                    .WithOne(x => x.DanhGiaSanPham)
                    .HasForeignKey<DanhGiaSanPham>(x => x.ChiTietDonHangId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // =====================================================
            // 16. LICH SU SU DUNG MA GIAM GIA
            // =====================================================
            modelBuilder.Entity<LichSuSuDungMaGiamGia>(entity =>
            {
                entity.ToTable("lich_su_su_dung_ma_giam_gia", table =>
                {
                    table.HasCheckConstraint(
                        "ck_lich_su_ma_giam_gia_tien",
                        "so_tien_duoc_giam >= 0"
                    );
                });

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.MaGiamGiaId)
                    .HasColumnName("ma_giam_gia_id");

                entity.Property(x => x.DonHangId)
                    .HasColumnName("don_hang_id");

                entity.Property(x => x.NguoiDungId)
                    .HasColumnName("nguoi_dung_id");

                entity.Property(x => x.SoTienDuocGiam)
                    .HasColumnName("so_tien_duoc_giam")
                    .HasPrecision(18, 2);

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasAlternateKey(x => new { x.MaGiamGiaId, x.DonHangId })
                    .HasName("uq_ma_giam_gia_don_hang");

                entity.HasIndex(x => new { x.MaGiamGiaId, x.NguoiDungId })
                    .HasDatabaseName("ix_lich_su_ma_giam_gia_nguoi_dung");

                entity.HasOne(x => x.MaGiamGia)
                    .WithMany(x => x.LichSuSuDungMaGiamGias)
                    .HasForeignKey(x => x.MaGiamGiaId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.DonHang)
                    .WithMany(x => x.LichSuSuDungMaGiamGias)
                    .HasForeignKey(x => x.DonHangId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.NguoiDung)
                    .WithMany(x => x.LichSuSuDungMaGiamGias)
                    .HasForeignKey(x => x.NguoiDungId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // =====================================================
            // 17. NHAT KY QUAN TRI
            // =====================================================
            modelBuilder.Entity<NhatKyQuanTri>(entity =>
            {
                entity.ToTable("nhat_ky_quan_tri");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("gen_random_uuid()");

                entity.Property(x => x.NguoiThucHienId)
                    .HasColumnName("nguoi_thuc_hien_id");

                entity.Property(x => x.HanhDong)
                    .HasColumnName("hanh_dong")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(x => x.DoiTuong)
                    .HasColumnName("doi_tuong")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(x => x.DoiTuongId)
                    .HasColumnName("doi_tuong_id");

                entity.Property(x => x.DuLieuTruoc)
                    .HasColumnName("du_lieu_truoc")
                    .HasColumnType("jsonb");

                entity.Property(x => x.DuLieuSau)
                    .HasColumnName("du_lieu_sau")
                    .HasColumnType("jsonb");

                entity.Property(x => x.DiaChiIp)
                    .HasColumnName("dia_chi_ip")
                    .HasColumnType("inet");

                entity.Property(x => x.NgayTao)
                    .HasColumnName("ngay_tao")
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasIndex(x => new { x.NguoiThucHienId, x.NgayTao })
                    .IsDescending(false, true)
                    .HasDatabaseName("ix_nhat_ky_quan_tri_nguoi_thuc_hien");

                entity.HasOne(x => x.NguoiThucHien)
                    .WithMany(x => x.NhatKyQuanTris)
                    .HasForeignKey(x => x.NguoiThucHienId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

        }
    }
}
