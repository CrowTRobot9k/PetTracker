CREATE TABLE [dbo].[Appointments]
(
	[Id] INT IDENTITY (1, 1) NOT NULL,
	[CompanyId] INT NULL,
	[UserId] NVARCHAR (450) NULL,
	[OwnerId] INT NULL,
	[PetId] INT NULL,
	[Title] NVARCHAR(500) NULL,
    [Description] NVARCHAR(1000) NULL,
	[Start] DATETIME NULL,
	[End] DATETIME NULL,
	CONSTRAINT [PK_Appointments] PRIMARY KEY CLUSTERED ([Id] ASC),
	CONSTRAINT [FK_Appointments_Companies] FOREIGN KEY ([CompanyId]) REFERENCES [dbo].[Companies] ([Id]),
	CONSTRAINT [FK_Appointments_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]),
	CONSTRAINT [FK_Appointments_Owners] FOREIGN KEY ([OwnerId]) REFERENCES [dbo].[Owners] ([Id]),
	CONSTRAINT [FK_Appointments_Pets] FOREIGN KEY ([PetId]) REFERENCES [dbo].[Pets] ([Id])
)
