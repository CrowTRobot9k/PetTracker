CREATE TABLE [dbo].[BreedTypes]
(
	[Id] INT NOT NULL,
	[PetTypeId] INT NOT NULL,
	[Name] NVARCHAR(200) NULL,
	CONSTRAINT [PK_BreedTypes] PRIMARY KEY CLUSTERED ([Id] ASC),
	CONSTRAINT [FK_BreedTypes_PetTypes] FOREIGN KEY ([PetTypeId]) REFERENCES [dbo].[PetTypes] ([Id])
)
