CREATE TABLE [dbo].[Companies]
(
	[Id]   INT IDENTITY (1, 1) NOT NULL,
    [Name] NVARCHAR(500) NULL,
	[CompanyCode] NVARCHAR(50) NULL, 
    CONSTRAINT [PK_Companies] PRIMARY KEY CLUSTERED ([Id] ASC),

)
