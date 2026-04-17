
CREATE DATABASE AiDrawingDb;
GO
USE AiDrawingDb;
GO


CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO


IF OBJECT_ID('Drawings', 'U') IS NOT NULL DROP TABLE Drawings;

CREATE TABLE Drawings (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,             
    Name NVARCHAR(255) NOT NULL,
    CommandsJson NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT FK_Drawings_Users FOREIGN KEY (UserId) 
    REFERENCES Users(Id) ON DELETE CASCADE
);
GO

SELECT * FROM Drawings;

CREATE PROCEDURE sp_SaveDrawing
    @UserId INT,
    @Name NVARCHAR(255),
    @CommandsJson NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Drawings (UserId, Name, CommandsJson)
    VALUES (@UserId, @Name, @CommandsJson);

    SELECT SCOPE_IDENTITY() AS NewId;
END

CREATE PROCEDURE sp_GetUserDrawings
    @UserId INT
AS
BEGIN
    SELECT Id, Name, CommandsJson
    FROM Drawings
    WHERE UserId = @UserId
    ORDER BY CreatedAt DESC;
END