CREATE TABLE [dbo].[PetBreedTypes]
(
	[Id]   INT IDENTITY (1, 1) NOT NULL,
	[PetId] INT NOT NULL,
	[BreedTypeId] INT NOT NULL,
	CONSTRAINT [PK_PetBreedTypes] PRIMARY KEY CLUSTERED ([Id] ASC),
	CONSTRAINT [FK_PetBreedTypes_Pets] FOREIGN KEY ([PetId]) REFERENCES [dbo].[Pets] ([Id]),
	CONSTRAINT [FK_PetBreedTypes_BreedTypes] FOREIGN KEY ([BreedTypeId]) REFERENCES [dbo].[BreedTypes] ([Id]),


)
