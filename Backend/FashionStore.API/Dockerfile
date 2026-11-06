
# ==========================================
# STAGE 1: BUILD APPLICATION
# ==========================================

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

# Copy file project
COPY ["FashionStore.API.csproj", "./"]

# Restore NuGet packages
RUN dotnet restore "FashionStore.API.csproj"

# Copy source code
COPY . .

# Build và publish
RUN dotnet publish "FashionStore.API.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore \
    /p:UseAppHost=false


# ==========================================
# STAGE 2: RUN APPLICATION
# ==========================================

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final

WORKDIR /app

# Render sử dụng port mặc định 10000
ENV ASPNETCORE_URLS=http://+:10000

EXPOSE 10000

# Copy kết quả publish từ stage build
COPY --from=build /app/publish .

# Chạy ASP.NET Core API
ENTRYPOINT ["dotnet", "FashionStore.API.dll"]
