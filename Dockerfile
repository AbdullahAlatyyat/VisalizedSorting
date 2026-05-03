# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# This stage is used to build the service project
# Build always runs on the native host platform to avoid QEMU cross-execution errors
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
ARG TARGETARCH
WORKDIR /src
COPY ["VisualizedAlgorithms.csproj", "VisualizedAlgorithms/"]
RUN dotnet restore "./VisualizedAlgorithms/VisualizedAlgorithms.csproj" -a $TARGETARCH
COPY . ./VisualizedAlgorithms/
WORKDIR "/src/VisualizedAlgorithms"
RUN dotnet build "./VisualizedAlgorithms.csproj" -c $BUILD_CONFIGURATION -a $TARGETARCH -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
ARG TARGETARCH
RUN dotnet publish "./VisualizedAlgorithms.csproj" -c $BUILD_CONFIGURATION -a $TARGETARCH -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "VisualizedAlgorithms.dll"]
