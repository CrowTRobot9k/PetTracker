﻿namespace PetTracker.Server.Models
{
    public class FileModel
    {
        public string? FileName { get; set; }
        public IFormFile FormFile { get; set; }
    }
}
