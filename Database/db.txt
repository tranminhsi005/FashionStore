-- ============================================================
-- WEBSITE THUONG MAI DIEN TU THOI TRANG
-- PostgreSQL / Supabase - Schema nghiep vu cho ASP.NET Core API
-- Ten bang/cot: tieng Viet khong dau, snake_case
--
-- LUU Y:
-- 1. Chay tren database moi/chua co cac bang nay.
-- 2. Script khong tao tai khoan quan tri mac dinh.
-- 3. Backend dung PasswordHasher<TUser> de bam mat khau.
-- 4. Anh duoc luu trong Supabase Storage; database chi luu duong dan.
-- 5. Backend phai cap nhat ton kho va ghi lich su trong cung transaction.
-- ============================================================

BEGIN;

-- ============================================================
-- 1. VAI TRO, NGUOI DUNG, PHIEN DANG NHAP
-- ============================================================

CREATE TABLE vai_tro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma VARCHAR(50) NOT NULL UNIQUE,
    ten VARCHAR(100) NOT NULL,
    mo_ta TEXT,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE nguoi_dung (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ho_ten VARCHAR(150) NOT NULL,
    email VARCHAR(320) NOT NULL,
    mat_khau_hash TEXT NOT NULL,
    so_dien_thoai VARCHAR(30),
    email_da_xac_minh BOOLEAN NOT NULL DEFAULT FALSE,
    dang_hoat_dong BOOLEAN NOT NULL DEFAULT TRUE,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX ux_nguoi_dung_email
    ON nguoi_dung (LOWER(email));

CREATE TABLE nguoi_dung_vai_tro (
    nguoi_dung_id UUID NOT NULL
        REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    vai_tro_id UUID NOT NULL
        REFERENCES vai_tro(id) ON DELETE RESTRICT,
    ngay_gan TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (nguoi_dung_id, vai_tro_id)
);

-- Chi luu SHA-256 hash cua refresh token, khong luu token goc.
CREATE TABLE phien_dang_nhap (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoi_dung_id UUID NOT NULL
        REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    refresh_token_hash CHAR(64) NOT NULL UNIQUE,
    thay_the_boi_hash CHAR(64),
    thiet_bi VARCHAR(250),
    dia_chi_ip INET,
    het_han_luc TIMESTAMPTZ NOT NULL,
    da_thu_hoi_luc TIMESTAMPTZ,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_phien_dang_nhap_nguoi_dung
    ON phien_dang_nhap (nguoi_dung_id, het_han_luc DESC);

CREATE TABLE dia_chi_giao_hang (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoi_dung_id UUID NOT NULL
        REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    ten_nguoi_nhan VARCHAR(150) NOT NULL,
    so_dien_thoai VARCHAR(30) NOT NULL,
    tinh_thanh VARCHAR(150) NOT NULL,
    quan_huyen VARCHAR(150),
    phuong_xa VARCHAR(150) NOT NULL,
    dia_chi_chi_tiet VARCHAR(300) NOT NULL,
    la_mac_dinh BOOLEAN NOT NULL DEFAULT FALSE,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX ux_dia_chi_mac_dinh
    ON dia_chi_giao_hang (nguoi_dung_id)
    WHERE la_mac_dinh = TRUE;

CREATE INDEX ix_dia_chi_nguoi_dung
    ON dia_chi_giao_hang (nguoi_dung_id);


-- ============================================================
-- 2. DANH MUC VA THUONG HIEU
-- ============================================================

CREATE TABLE danh_muc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    danh_muc_cha_id UUID
        REFERENCES danh_muc(id) ON DELETE SET NULL,
    ten VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    mo_ta TEXT,
    thu_tu_hien_thi INT NOT NULL DEFAULT 0,
    dang_hoat_dong BOOLEAN NOT NULL DEFAULT TRUE,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_danh_muc_khong_tu_lam_cha
        CHECK (danh_muc_cha_id IS NULL OR danh_muc_cha_id <> id)
);

CREATE INDEX ix_danh_muc_cha
    ON danh_muc (danh_muc_cha_id);

CREATE TABLE thuong_hieu (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ten VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    mo_ta TEXT,
    duong_dan_logo VARCHAR(800),
    dang_hoat_dong BOOLEAN NOT NULL DEFAULT TRUE,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 3. KICH CO, MAU SAC, SAN PHAM, BIEN THE
-- ============================================================

CREATE TABLE kich_co (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma VARCHAR(30) NOT NULL UNIQUE,
    ten_hien_thi VARCHAR(50) NOT NULL,
    thu_tu_hien_thi INT NOT NULL DEFAULT 0,
    dang_hoat_dong BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE mau_sac (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ten VARCHAR(80) NOT NULL,
    ma_hex VARCHAR(7),
    thu_tu_hien_thi INT NOT NULL DEFAULT 0,
    dang_hoat_dong BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT ck_mau_sac_ma_hex
        CHECK (ma_hex IS NULL OR ma_hex ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE UNIQUE INDEX ux_mau_sac_ten
    ON mau_sac (LOWER(ten));

CREATE TABLE san_pham (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    danh_muc_id UUID NOT NULL
        REFERENCES danh_muc(id) ON DELETE RESTRICT,
    thuong_hieu_id UUID
        REFERENCES thuong_hieu(id) ON DELETE SET NULL,
    ten VARCHAR(250) NOT NULL,
    slug VARCHAR(280) NOT NULL UNIQUE,
    mo_ta TEXT,
    chat_lieu VARCHAR(200),
    doi_tuong VARCHAR(30),
    trang_thai VARCHAR(30) NOT NULL DEFAULT 'nhap',
    noi_bat BOOLEAN NOT NULL DEFAULT FALSE,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_san_pham_doi_tuong
        CHECK (
            doi_tuong IS NULL OR
            doi_tuong IN ('nam', 'nu', 'unisex', 'tre_em', 'khac')
        ),
    CONSTRAINT ck_san_pham_trang_thai
        CHECK (
            trang_thai IN (
                'nhap', 'dang_ban', 'an', 'ngung_kinh_doanh'
            )
        )
);

CREATE INDEX ix_san_pham_danh_muc_trang_thai
    ON san_pham (danh_muc_id, trang_thai);

CREATE INDEX ix_san_pham_thuong_hieu
    ON san_pham (thuong_hieu_id);

CREATE INDEX ix_san_pham_ngay_tao
    ON san_pham (ngay_tao DESC);

CREATE INDEX ix_san_pham_noi_bat
    ON san_pham (noi_bat)
    WHERE noi_bat = TRUE AND trang_thai = 'dang_ban';

CREATE TABLE bien_the_san_pham (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    san_pham_id UUID NOT NULL
        REFERENCES san_pham(id) ON DELETE RESTRICT,
    kich_co_id UUID
        REFERENCES kich_co(id) ON DELETE RESTRICT,
    mau_sac_id UUID
        REFERENCES mau_sac(id) ON DELETE RESTRICT,
    sku VARCHAR(100) NOT NULL,
    gia_ban NUMERIC(18,2) NOT NULL,
    gia_niem_yet NUMERIC(18,2),
    so_luong_ton INT NOT NULL DEFAULT 0,
    dang_ban BOOLEAN NOT NULL DEFAULT TRUE,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_bien_the_gia_ban CHECK (gia_ban >= 0),
    CONSTRAINT ck_bien_the_gia_niem_yet
        CHECK (gia_niem_yet IS NULL OR gia_niem_yet >= gia_ban),
    CONSTRAINT ck_bien_the_ton_kho CHECK (so_luong_ton >= 0),
    CONSTRAINT uq_bien_the_id_san_pham UNIQUE (id, san_pham_id)
);

CREATE UNIQUE INDEX ux_bien_the_sku
    ON bien_the_san_pham (LOWER(sku));

-- Cac unique index co dieu kien de xu ly ca kich_co_id/mau_sac_id NULL.
CREATE UNIQUE INDEX ux_bien_the_size_mau
    ON bien_the_san_pham (san_pham_id, kich_co_id, mau_sac_id)
    WHERE kich_co_id IS NOT NULL AND mau_sac_id IS NOT NULL;

CREATE UNIQUE INDEX ux_bien_the_chi_size
    ON bien_the_san_pham (san_pham_id, kich_co_id)
    WHERE kich_co_id IS NOT NULL AND mau_sac_id IS NULL;

CREATE UNIQUE INDEX ux_bien_the_chi_mau
    ON bien_the_san_pham (san_pham_id, mau_sac_id)
    WHERE kich_co_id IS NULL AND mau_sac_id IS NOT NULL;

CREATE UNIQUE INDEX ux_bien_the_khong_phan_loai
    ON bien_the_san_pham (san_pham_id)
    WHERE kich_co_id IS NULL AND mau_sac_id IS NULL;

CREATE INDEX ix_bien_the_san_pham
    ON bien_the_san_pham (san_pham_id);

CREATE INDEX ix_bien_the_loc_gia
    ON bien_the_san_pham (gia_ban)
    WHERE dang_ban = TRUE;


-- ============================================================
-- 4. ANH SAN PHAM (FILE NAM TRONG SUPABASE STORAGE)
-- ============================================================

CREATE TABLE anh_san_pham (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    san_pham_id UUID NOT NULL
        REFERENCES san_pham(id) ON DELETE CASCADE,
    bien_the_san_pham_id UUID
        REFERENCES bien_the_san_pham(id) ON DELETE SET NULL,
    duong_dan_luu_tru VARCHAR(800) NOT NULL UNIQUE,
    mo_ta_anh VARCHAR(300),
    la_anh_chinh BOOLEAN NOT NULL DEFAULT FALSE,
    thu_tu_hien_thi INT NOT NULL DEFAULT 0,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX ux_anh_san_pham_anh_chinh
    ON anh_san_pham (san_pham_id)
    WHERE la_anh_chinh = TRUE;

CREATE INDEX ix_anh_san_pham_sap_xep
    ON anh_san_pham (san_pham_id, thu_tu_hien_thi);


-- ============================================================
-- 5. GIO HANG
-- ============================================================

CREATE TABLE gio_hang (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoi_dung_id UUID NOT NULL UNIQUE
        REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE gio_hang_chi_tiet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gio_hang_id UUID NOT NULL
        REFERENCES gio_hang(id) ON DELETE CASCADE,
    bien_the_san_pham_id UUID NOT NULL
        REFERENCES bien_the_san_pham(id) ON DELETE RESTRICT,
    so_luong INT NOT NULL,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_gio_hang_so_luong CHECK (so_luong > 0),
    CONSTRAINT uq_gio_hang_bien_the UNIQUE (gio_hang_id, bien_the_san_pham_id)
);

CREATE INDEX ix_gio_hang_chi_tiet_gio_hang
    ON gio_hang_chi_tiet (gio_hang_id);


-- ============================================================
-- 6. MA GIAM GIA
-- ============================================================

CREATE TABLE ma_giam_gia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma VARCHAR(80) NOT NULL,
    ten VARCHAR(200) NOT NULL,
    loai_giam_gia VARCHAR(20) NOT NULL,
    gia_tri NUMERIC(18,2) NOT NULL,
    don_hang_toi_thieu NUMERIC(18,2) NOT NULL DEFAULT 0,
    tien_giam_toi_da NUMERIC(18,2),
    so_luot_su_dung_toi_da INT,
    so_luot_da_su_dung INT NOT NULL DEFAULT 0,
    moi_nguoi_su_dung_toi_da INT NOT NULL DEFAULT 1,
    bat_dau_luc TIMESTAMPTZ NOT NULL,
    ket_thuc_luc TIMESTAMPTZ NOT NULL,
    dang_hoat_dong BOOLEAN NOT NULL DEFAULT TRUE,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_ma_giam_gia_loai
        CHECK (loai_giam_gia IN ('phan_tram', 'so_tien')),
    CONSTRAINT ck_ma_giam_gia_gia_tri CHECK (gia_tri > 0),
    CONSTRAINT ck_ma_giam_gia_toi_thieu CHECK (don_hang_toi_thieu >= 0),
    CONSTRAINT ck_ma_giam_gia_toi_da
        CHECK (tien_giam_toi_da IS NULL OR tien_giam_toi_da >= 0),
    CONSTRAINT ck_ma_giam_gia_so_luot
        CHECK (
            (so_luot_su_dung_toi_da IS NULL OR so_luot_su_dung_toi_da > 0)
            AND so_luot_da_su_dung >= 0
            AND moi_nguoi_su_dung_toi_da > 0
        ),
    CONSTRAINT ck_ma_giam_gia_thoi_gian CHECK (ket_thuc_luc > bat_dau_luc),
    CONSTRAINT ck_ma_giam_gia_phan_tram
        CHECK (loai_giam_gia <> 'phan_tram' OR gia_tri <= 100)
);

CREATE UNIQUE INDEX ux_ma_giam_gia_ma
    ON ma_giam_gia (LOWER(ma));


-- ============================================================
-- 7. DON HANG
-- ============================================================

CREATE TABLE don_hang (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_don_hang VARCHAR(60) NOT NULL UNIQUE,
    nguoi_dung_id UUID NOT NULL
        REFERENCES nguoi_dung(id) ON DELETE RESTRICT,
    ma_giam_gia_id UUID
        REFERENCES ma_giam_gia(id) ON DELETE SET NULL,
    ma_giam_gia_da_ap_dung VARCHAR(80),
    trang_thai VARCHAR(30) NOT NULL DEFAULT 'cho_xac_nhan',
    trang_thai_thanh_toan VARCHAR(30) NOT NULL DEFAULT 'cho_thanh_toan',
    phuong_thuc_thanh_toan VARCHAR(30) NOT NULL DEFAULT 'cod',
    tong_tien_hang NUMERIC(18,2) NOT NULL,
    tien_giam_gia NUMERIC(18,2) NOT NULL DEFAULT 0,
    phi_van_chuyen NUMERIC(18,2) NOT NULL DEFAULT 0,
    tong_thanh_toan NUMERIC(18,2) NOT NULL,
    tien_te VARCHAR(3) NOT NULL DEFAULT 'VND',
    ten_nguoi_nhan VARCHAR(150) NOT NULL,
    so_dien_thoai_nhan VARCHAR(30) NOT NULL,
    tinh_thanh_nhan VARCHAR(150) NOT NULL,
    quan_huyen_nhan VARCHAR(150),
    phuong_xa_nhan VARCHAR(150) NOT NULL,
    dia_chi_chi_tiet_nhan VARCHAR(300) NOT NULL,
    ghi_chu_khach_hang TEXT,
    ly_do_huy TEXT,
    khoa_idempotent UUID,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_don_hang_trang_thai
        CHECK (
            trang_thai IN (
                'cho_xac_nhan', 'da_xac_nhan', 'dang_chuan_bi',
                'dang_giao', 'da_giao', 'da_huy'
            )
        ),
    CONSTRAINT ck_don_hang_thanh_toan
        CHECK (
            trang_thai_thanh_toan IN (
                'cho_thanh_toan', 'da_thanh_toan', 'that_bai',
                'da_hoan_tien', 'hoan_tien_mot_phan'
            )
        ),
    CONSTRAINT ck_don_hang_phuong_thuc
        CHECK (phuong_thuc_thanh_toan IN ('cod', 'chuyen_khoan', 'cong_thanh_toan')),
    CONSTRAINT ck_don_hang_tien_te CHECK (tien_te = 'VND'),
    CONSTRAINT ck_don_hang_tien
        CHECK (
            tong_tien_hang >= 0
            AND tien_giam_gia >= 0
            AND tien_giam_gia <= tong_tien_hang
            AND phi_van_chuyen >= 0
            AND tong_thanh_toan = tong_tien_hang - tien_giam_gia + phi_van_chuyen
        )
);

CREATE UNIQUE INDEX ux_don_hang_idempotent
    ON don_hang (nguoi_dung_id, khoa_idempotent)
    WHERE khoa_idempotent IS NOT NULL;

CREATE INDEX ix_don_hang_nguoi_dung_ngay_tao
    ON don_hang (nguoi_dung_id, ngay_tao DESC);

CREATE INDEX ix_don_hang_trang_thai_ngay_tao
    ON don_hang (trang_thai, ngay_tao DESC);


-- ============================================================
-- 8. CHI TIET DON HANG - LUU SNAPSHOT LUC MUA
-- ============================================================

CREATE TABLE chi_tiet_don_hang (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    don_hang_id UUID NOT NULL
        REFERENCES don_hang(id) ON DELETE CASCADE,
    san_pham_id UUID
        REFERENCES san_pham(id) ON DELETE SET NULL,
    bien_the_san_pham_id UUID
        REFERENCES bien_the_san_pham(id) ON DELETE SET NULL,
    ten_san_pham VARCHAR(250) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    ten_kich_co VARCHAR(50),
    ten_mau_sac VARCHAR(80),
    so_luong INT NOT NULL,
    don_gia NUMERIC(18,2) NOT NULL,
    tien_giam_gia NUMERIC(18,2) NOT NULL DEFAULT 0,
    thanh_tien NUMERIC(18,2) NOT NULL,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_chi_tiet_don_hang_so_luong CHECK (so_luong > 0),
    CONSTRAINT ck_chi_tiet_don_hang_tien
        CHECK (
            don_gia >= 0
            AND tien_giam_gia >= 0
            AND tien_giam_gia <= so_luong * don_gia
            AND thanh_tien = so_luong * don_gia - tien_giam_gia
        )
);

CREATE INDEX ix_chi_tiet_don_hang_don_hang
    ON chi_tiet_don_hang (don_hang_id);


-- ============================================================
-- 9. THANH TOAN
-- ============================================================

CREATE TABLE thanh_toan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    don_hang_id UUID NOT NULL
        REFERENCES don_hang(id) ON DELETE RESTRICT,
    cong_thanh_toan VARCHAR(80),
    phuong_thuc VARCHAR(30) NOT NULL,
    so_tien NUMERIC(18,2) NOT NULL,
    tien_te VARCHAR(3) NOT NULL DEFAULT 'VND',
    trang_thai VARCHAR(30) NOT NULL DEFAULT 'cho_thanh_toan',
    ma_giao_dich_nha_cung_cap VARCHAR(200),
    khoa_idempotent VARCHAR(200),
    thoi_diem_thanh_toan TIMESTAMPTZ,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_thanh_toan_so_tien CHECK (so_tien >= 0),
    CONSTRAINT ck_thanh_toan_trang_thai
        CHECK (
            trang_thai IN (
                'cho_thanh_toan', 'dang_xu_ly', 'thanh_cong',
                'that_bai', 'da_hoan_tien'
            )
        )
);

CREATE UNIQUE INDEX ux_thanh_toan_idempotent
    ON thanh_toan (khoa_idempotent)
    WHERE khoa_idempotent IS NOT NULL;

CREATE UNIQUE INDEX ux_thanh_toan_ma_giao_dich
    ON thanh_toan (cong_thanh_toan, ma_giao_dich_nha_cung_cap)
    WHERE ma_giao_dich_nha_cung_cap IS NOT NULL;

CREATE INDEX ix_thanh_toan_don_hang
    ON thanh_toan (don_hang_id);


-- ============================================================
-- 10. VAN CHUYEN
-- ============================================================

CREATE TABLE van_chuyen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    don_hang_id UUID NOT NULL UNIQUE
        REFERENCES don_hang(id) ON DELETE RESTRICT,
    don_vi_van_chuyen VARCHAR(150),
    ma_van_don VARCHAR(150),
    trang_thai VARCHAR(30) NOT NULL DEFAULT 'cho_xu_ly',
    thoi_diem_gui_hang TIMESTAMPTZ,
    thoi_diem_giao_hang TIMESTAMPTZ,
    ghi_chu TEXT,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_van_chuyen_trang_thai
        CHECK (
            trang_thai IN (
                'cho_xu_ly', 'da_lay_hang', 'dang_giao',
                'da_giao', 'giao_that_bai', 'da_huy'
            )
        )
);


-- ============================================================
-- 11. LICH SU TRANG THAI DON HANG
-- ============================================================

CREATE TABLE lich_su_trang_thai_don_hang (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    don_hang_id UUID NOT NULL
        REFERENCES don_hang(id) ON DELETE RESTRICT,
    trang_thai_cu VARCHAR(30),
    trang_thai_moi VARCHAR(30) NOT NULL,
    nguoi_thuc_hien_id UUID
        REFERENCES nguoi_dung(id) ON DELETE SET NULL,
    ghi_chu TEXT,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_lich_su_trang_thai_don_hang
    ON lich_su_trang_thai_don_hang (don_hang_id, ngay_tao DESC);


-- ============================================================
-- 12. LICH SU TON KHO
-- ============================================================

CREATE TABLE lich_su_ton_kho (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bien_the_san_pham_id UUID NOT NULL
        REFERENCES bien_the_san_pham(id) ON DELETE RESTRICT,
    don_hang_id UUID
        REFERENCES don_hang(id) ON DELETE SET NULL,
    nguoi_thuc_hien_id UUID
        REFERENCES nguoi_dung(id) ON DELETE SET NULL,
    so_luong_thay_doi INT NOT NULL,
    loai_giao_dich VARCHAR(30) NOT NULL,
    ghi_chu TEXT,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_lich_su_ton_kho_so_luong CHECK (so_luong_thay_doi <> 0),
    CONSTRAINT ck_lich_su_ton_kho_loai
        CHECK (
            loai_giao_dich IN (
                'nhap_hang', 'dat_hang', 'huy_don',
                'dieu_chinh', 'hoan_hang', 'khac'
            )
        )
);

CREATE INDEX ix_lich_su_ton_kho_bien_the
    ON lich_su_ton_kho (bien_the_san_pham_id, ngay_tao DESC);

CREATE INDEX ix_lich_su_ton_kho_don_hang
    ON lich_su_ton_kho (don_hang_id)
    WHERE don_hang_id IS NOT NULL;


-- ============================================================
-- 13. SAN PHAM YEU THICH
-- ============================================================

CREATE TABLE san_pham_yeu_thich (
    nguoi_dung_id UUID NOT NULL
        REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    san_pham_id UUID NOT NULL
        REFERENCES san_pham(id) ON DELETE CASCADE,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (nguoi_dung_id, san_pham_id)
);


-- ============================================================
-- 14. DANH GIA SAN PHAM
-- Backend phai xac minh chi tiet don hang thuoc nguoi dung va san pham.
-- ============================================================

CREATE TABLE danh_gia_san_pham (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoi_dung_id UUID NOT NULL
        REFERENCES nguoi_dung(id) ON DELETE RESTRICT,
    san_pham_id UUID NOT NULL
        REFERENCES san_pham(id) ON DELETE RESTRICT,
    chi_tiet_don_hang_id UUID NOT NULL UNIQUE
        REFERENCES chi_tiet_don_hang(id) ON DELETE RESTRICT,
    so_sao SMALLINT NOT NULL,
    noi_dung TEXT,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'cho_duyet',
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_danh_gia_so_sao CHECK (so_sao BETWEEN 1 AND 5),
    CONSTRAINT ck_danh_gia_trang_thai
        CHECK (trang_thai IN ('cho_duyet', 'hien_thi', 'an')),
    CONSTRAINT uq_danh_gia_nguoi_dung_san_pham
        UNIQUE (nguoi_dung_id, san_pham_id)
);

CREATE INDEX ix_danh_gia_san_pham
    ON danh_gia_san_pham (san_pham_id, trang_thai, ngay_tao DESC);


-- ============================================================
-- 15. LICH SU SU DUNG MA GIAM GIA
-- ============================================================

CREATE TABLE lich_su_su_dung_ma_giam_gia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_giam_gia_id UUID NOT NULL
        REFERENCES ma_giam_gia(id) ON DELETE RESTRICT,
    don_hang_id UUID NOT NULL
        REFERENCES don_hang(id) ON DELETE RESTRICT,
    nguoi_dung_id UUID NOT NULL
        REFERENCES nguoi_dung(id) ON DELETE RESTRICT,
    so_tien_duoc_giam NUMERIC(18,2) NOT NULL,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_lich_su_ma_giam_gia_tien CHECK (so_tien_duoc_giam >= 0),
    CONSTRAINT uq_ma_giam_gia_don_hang UNIQUE (ma_giam_gia_id, don_hang_id)
);

CREATE INDEX ix_lich_su_ma_giam_gia_nguoi_dung
    ON lich_su_su_dung_ma_giam_gia (ma_giam_gia_id, nguoi_dung_id);


-- ============================================================
-- 16. NHAT KY QUAN TRI
-- ============================================================

CREATE TABLE nhat_ky_quan_tri (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoi_thuc_hien_id UUID
        REFERENCES nguoi_dung(id) ON DELETE SET NULL,
    hanh_dong VARCHAR(100) NOT NULL,
    doi_tuong VARCHAR(100) NOT NULL,
    doi_tuong_id UUID,
    du_lieu_truoc JSONB,
    du_lieu_sau JSONB,
    dia_chi_ip INET,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_nhat_ky_quan_tri_nguoi_thuc_hien
    ON nhat_ky_quan_tri (nguoi_thuc_hien_id, ngay_tao DESC);


-- ============================================================
-- 17. DU LIEU KHOI TAO
-- ============================================================

INSERT INTO vai_tro (ma, ten, mo_ta)
VALUES
    ('khach_hang', 'Khách hàng', 'Người mua sản phẩm trên website'),
    ('quan_tri_vien', 'Quản trị viên', 'Người quản lý hệ thống')
ON CONFLICT (ma) DO NOTHING;

INSERT INTO kich_co (ma, ten_hien_thi, thu_tu_hien_thi)
VALUES
    ('S', 'S', 1),
    ('M', 'M', 2),
    ('L', 'L', 3),
    ('XL', 'XL', 4),
    ('XXL', 'XXL', 5),
    ('FREESIZE', 'Free size', 6)
ON CONFLICT (ma) DO NOTHING;

INSERT INTO mau_sac (ten, ma_hex, thu_tu_hien_thi)
VALUES
    ('Đen', '#000000', 1),
    ('Trắng', '#FFFFFF', 2),
    ('Xám', '#808080', 3),
    ('Đỏ', '#FF0000', 4),
    ('Xanh navy', '#000080', 5),
    ('Be', '#DCC7A1', 6)
ON CONFLICT DO NOTHING;

COMMIT;

-- ============================================================
-- KIEM TRA SAU KHI CHAY
-- ============================================================
-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
-- ORDER BY table_name;
--
-- SELECT * FROM vai_tro;
-- SELECT * FROM kich_co ORDER BY thu_tu_hien_thi;
-- SELECT * FROM mau_sac ORDER BY thu_tu_hien_thi;
-- ============================================================
