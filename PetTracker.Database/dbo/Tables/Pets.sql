CREATE TABLE [dbo].[Pets]
(
	[Id]   INT IDENTITY (1, 1) NOT NULL,
	[OwnerId] INT NULL,
    [Name] NVARCHAR(500) NULL,
	[PetTypeId] INT NOT NULL,
	[Gender] NVARCHAR(50) NULL,
	CONSTRAINT [PK_Pets] PRIMARY KEY CLUSTERED ([Id] ASC),
	CONSTRAINT [FK_Pets_Owners] FOREIGN KEY ([OwnerId]) REFERENCES [dbo].[Owners] ([Id]),
	CONSTRAINT [FK_Pets_PetTypes] FOREIGN KEY ([PetTypeId]) REFERENCES [dbo].[PetTypes] ([Id])

)
