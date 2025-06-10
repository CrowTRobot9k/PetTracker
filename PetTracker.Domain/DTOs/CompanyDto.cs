using PetTracker.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class CompanyDto
    {
        public CompanyDto()
        {
        }
        public CompanyDto(Company company)
        {
            Id = company.Id;
            Name = company.Name;
            CompanyCode = company.CompanyCode;
        }
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? CompanyCode { get; set; }
    }
}
