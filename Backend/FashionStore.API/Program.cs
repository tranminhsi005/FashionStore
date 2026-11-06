
using FashionStore.API.Configurations;
using FashionStore.API.Data;
using FashionStore.API.Interfaces;
using FashionStore.API.Models.Entities;
using FashionStore.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. CONTROLLERS VA SWAGGER

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();


builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhap Access Token vao day."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


// 2. KET NOI POSTGRESQL

var connectionString = builder.Configuration
    .GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Chua cau hinh DefaultConnection."
    );
}

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

// 3. CAU HINH JWT

var jwtOptions = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtOptions>();

if (jwtOptions == null)
{
    throw new InvalidOperationException(
        "Chua cau hinh Jwt."
    );
}

if (string.IsNullOrWhiteSpace(jwtOptions.Secret))
{
    throw new InvalidOperationException(
        "Chua cau hinh Jwt:Secret trong User Secrets."
    );
}

byte[] khoaKy;

try
{
    khoaKy = Convert.FromBase64String(jwtOptions.Secret);
}
catch (FormatException)
{
    throw new InvalidOperationException(
        "Jwt:Secret phai la chuoi Base64 hop le."
    );
}

if (khoaKy.Length < 32)
{
    throw new InvalidOperationException(
        "Jwt:Secret phai co it nhat 32 byte sau khi giai ma Base64."
    );
}

if (string.IsNullOrWhiteSpace(jwtOptions.Issuer) ||
    string.IsNullOrWhiteSpace(jwtOptions.Audience) ||
    jwtOptions.AccessTokenMinutes <= 0 ||
    jwtOptions.RefreshTokenDays <= 0)
{
    throw new InvalidOperationException(
        "Cau hinh Jwt khong hop le."
    );
}

builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection("Jwt")
);

var signingKey = new SymmetricSecurityKey(khoaKy);

// 4. AUTHENTICATION - JWT BEARER

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Giu nguyen cac claim sub, name, role
        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,

            IssuerSigningKey = signingKey,

            ValidateIssuer = true,

            ValidIssuer = jwtOptions.Issuer,

            ValidateAudience = true,

            ValidAudience = jwtOptions.Audience,

            ValidateLifetime = true,

            ClockSkew = TimeSpan.FromSeconds(30),

            NameClaimType = "name",

            RoleClaimType = "role"
        };
    });


// 5. AUTHORIZATION

builder.Services.AddAuthorization();

// 6. PASSWORD HASHER

builder.Services.AddScoped<
    IPasswordHasher<NguoiDung>,
    PasswordHasher<NguoiDung>
>();

// 7. SERVICES

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IDanhMucService, DanhMucService>();
builder.Services.AddScoped<IThuongHieuService, ThuongHieuService>();
builder.Services.AddScoped<IKichCoService, KichCoService>();
builder.Services.AddScoped<IMauSacService, MauSacService>();
builder.Services.AddScoped<ISanPhamService, SanPhamService>();
builder.Services.AddScoped<IAnhSanPhamService, AnhSanPhamService>();
builder.Services.AddScoped<ITonKhoService, TonKhoService>();
builder.Services.AddScoped<IGioHangService, GioHangService>();
builder.Services.AddScoped<IDiaChiService, DiaChiService>();
builder.Services.AddScoped<IDonHangService, DonHangService>();
builder.Services.AddScoped<IQuanTriDonHangService, QuanTriDonHangService>();
builder.Services.AddScoped<IHuyDonHangService, HuyDonHangService>();
builder.Services.AddScoped<IThanhToanService, ThanhToanService>();

// 8. CORS

var danhSachNguon = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>();

if (danhSachNguon.Length == 0)
{
    throw new InvalidOperationException(
        "Chua cau hinh Cors:AllowedOrigins."
    );
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins(danhSachNguon)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


builder.Services.Configure<SupabaseOptions>(
    builder.Configuration.GetSection("Supabase")
);

builder.Services.AddHttpClient<ISupabaseStorageService, SupabaseStorageService>();


// 9. BUILD APPLICATION

var app = builder.Build();

// 10. MIDDLEWARE

if (app.Environment.IsDevelopment())
{

    app.UseSwagger();

    app.UseSwaggerUI();
    
    app.UseHttpsRedirection();
}

app.UseRouting();

app.UseCors("FrontendPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
