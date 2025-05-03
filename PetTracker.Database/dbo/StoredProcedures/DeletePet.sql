create procedure DeletePet
@petId int

as 
begin

DECLARE @fileIds TABLE (FileId INT)

insert into @fileIds
select fu.Id 
from [dbo].[Pets] p 
join [FileUploadMappings] fup
on fup.PetId = p.Id
join [FileUploads] fu 
on fup.FileUploadId = fu.Id
where p.Id = @petId

  delete fup from [dbo].[Pets] p 
  join [FileUploadMappings] fup
  on fup.PetId = p.Id

  delete fu from [FileUploads] fu 
  join @fileIds f on f.FileId = fu.Id

  delete pbt from [dbo].[Pets] p 
  join PetBreedTypes pbt 
  on pbt.PetId = p.Id
  where p.Id = @petId

  delete p from Pets p 
  where p.Id = @petId
  end