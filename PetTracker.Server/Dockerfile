# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Install Node.js (LTS version)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs

ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["PetTracker.Server/PetTracker.Server.csproj", "PetTracker.Server/"]
COPY ["PetTracker.Infrastucture/PetTracker.Infrastucture.csproj", "PetTracker.Infrastucture/"]
COPY ["PetTracker.Domain/PetTracker.Domain.csproj", "PetTracker.Domain/"]
COPY ["PetTracker.SqlDb/PetTracker.SqlDb.csproj", "PetTracker.SqlDb/"]
COPY ["PetTracker.UI/PetTracker.UI.esproj", "PetTracker.UI/"]
RUN dotnet restore "./PetTracker.Server/PetTracker.Server.csproj"
COPY . .

# Build the React app
WORKDIR /src/PetTracker.UI
RUN rm -rf node_modules package-lock.json && npm cache clean --force
RUN npm install
RUN npm run build

# Copy the built UI to the ASP.NET Core wwwroot
WORKDIR /src/PetTracker.Server
RUN mkdir -p ./wwwroot
RUN rm -rf ./wwwroot/*
RUN cp -r /src/PetTracker.UI/dist/* ./wwwroot/

WORKDIR "/src/PetTracker.Server"
RUN dotnet build "./PetTracker.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./PetTracker.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PetTracker.Server.dll"]