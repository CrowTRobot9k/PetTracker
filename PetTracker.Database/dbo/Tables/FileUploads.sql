CREATE TABLE [dbo].[FileUploads]
(
	[Id]		INT IDENTITY (1, 1) NOT NULL,
	[FileName]	NVARCHAR (500) NULL,
	[FilePath]	NVARCHAR (500) NULL,
	[FileExtension]	NVARCHAR (50) NULL,
	[FileDescription]	NVARCHAR (500) NULL,
	[FileData] VARBINARY (MAX) NULL,
	[CreatedDate] DateTime2(7) NULL DEFAULT (GetDate()),
	CONSTRAINT [PK_FileUploads] PRIMARY KEY CLUSTERED ([Id] ASC),
)
