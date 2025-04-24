﻿CREATE TABLE [dbo].[FileUploads]
(
	[Id]		INT IDENTITY (1, 1) NOT NULL,
	[FileName]	NVARCHAR (500) NULL,
	[FilePath]	NVARCHAR (500) NULL,
	[FileType]	NVARCHAR (50) NULL,
	[FileDescription]	NVARCHAR (500) NULL,
	CONSTRAINT [PK_FileUploads] PRIMARY KEY CLUSTERED ([Id] ASC),
)
