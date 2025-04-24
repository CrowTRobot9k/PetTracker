CREATE TABLE [dbo].[FileUploadMappings]
(
	[Id]		INT IDENTITY (1, 1) NOT NULL,
	[AspNetUserId] NVARCHAR (450) NULL,
	[OwnerId] INT NULL,
	[CompanyId] INT NULL,
	[PetId] INT NULL,
	[FileUploadId] INT NULL,
	CONSTRAINT [PK_FileUploadMappings] PRIMARY KEY CLUSTERED ([Id] ASC),
	CONSTRAINT [FK_FileUploadMappings_AspNetUsers] FOREIGN KEY ([AspNetUserId]) REFERENCES [dbo].[AspNetUsers] ([Id]),
	CONSTRAINT [FK_FileUploadMappings_Owners] FOREIGN KEY ([OwnerId]) REFERENCES [dbo].[Owners] ([Id]),
	CONSTRAINT [FK_FileUploadMappings_Companies] FOREIGN KEY ([CompanyId]) REFERENCES [dbo].[Companies] ([Id]),
	CONSTRAINT [FK_FileUploadMappings_Pets] FOREIGN KEY ([PetId]) REFERENCES [dbo].[Pets] ([Id]),
	CONSTRAINT [FK_FileUploadMappings_FileUpload] FOREIGN KEY ([FileUploadId]) REFERENCES [dbo].[FileUploads] ([Id])
)
