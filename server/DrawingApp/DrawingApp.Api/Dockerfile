FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["DrawingApp.Api/DrawingApp.Api.csproj", "DrawingApp.Api/"]
COPY ["DrawingApp.DM/DrawingApp.DM.csproj", "DrawingApp.DM/"]
COPY ["DrawingApp.Provider/DrawingApp.Provider.csproj", "DrawingApp.Provider/"]

RUN dotnet restore "DrawingApp.Api/DrawingApp.Api.csproj"

COPY . .
WORKDIR "/src/DrawingApp.Api"
RUN dotnet build "DrawingApp.Api.csproj" -c Release -o /app/build

#Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/build .
ENV ASPNETCORE_URLS=http://+:5045
EXPOSE 5045
ENTRYPOINT ["dotnet", "DrawingApp.Api.dll"]