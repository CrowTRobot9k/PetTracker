CREATE TABLE [dbo].[UserClaims]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [UserId] NVARCHAR(MAX) NULL, 
    [ClaimType] NVARCHAR(MAX) NULL, 
    [ClaimValue] NVARCHAR(MAX) NULL
)
