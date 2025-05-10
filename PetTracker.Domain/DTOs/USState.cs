using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetTracker.Domain.DTOs
{
    public class USState
    {
        public string Name { get; set; }
        public string Abbr { get; set; }
        public static List<USState> GetStates()
        {
            var states = new List<USState>
            {
                new USState() { Name = "Alabama", Abbr = "AL" },
                new USState() { Name = "Alaska", Abbr = "AK" },
                new USState() { Name = "Arizona", Abbr = "AZ" },
                new USState() { Name = "Arkansas", Abbr = "AR" },
                new USState() { Name = "California", Abbr = "CA" },
                new USState() { Name = "Colorado", Abbr = "CO" },
                new USState() { Name = "Connecticut", Abbr = "CT" },
                new USState() { Name = "Delaware", Abbr = "DE" },
                new USState() { Name = "District of Columbia", Abbr = "DC" },
                new USState() { Name = "Florida", Abbr = "FL" },
                new USState() { Name = "Georgia", Abbr = "GA" },
                new USState() { Name = "Hawaii", Abbr = "HI" },
                new USState() { Name = "Idaho", Abbr = "ID" },
                new USState() { Name = "Illinois", Abbr = "IL" },
                new USState() { Name = "Indiana", Abbr = "IN" },
                new USState() { Name = "Iowa", Abbr = "IA" },
                new USState() { Name = "Kansas", Abbr = "KS" },
                new USState() { Name = "Kentucky", Abbr = "KY" },
                new USState() { Name = "Louisiana", Abbr = "LA" },
                new USState() { Name = "Maine", Abbr = "ME" },
                new USState() { Name = "Maryland", Abbr = "MD" },
                new USState() { Name = "Massachusetts", Abbr = "MA" },
                new USState() { Name = "Michigan", Abbr = "MI" },
                new USState() { Name = "Minnesota", Abbr = "MN" },
                new USState() { Name = "Mississippi", Abbr = "MS" },
                new USState() { Name = "Missouri", Abbr = "MO" },
                new USState() { Name = "Montana", Abbr = "MT" },
                new USState() { Name = "Nebraska", Abbr = "NE" },
                new USState() { Name = "Nevada", Abbr = "NV" },
                new USState() { Name = "New Hampshire", Abbr = "NH" },
                new USState() { Name = "New Jersey", Abbr = "NJ" },
                new USState() { Name = "New Mexico", Abbr = "NM" },
                new USState() { Name = "New York", Abbr = "NY" },
                new USState() { Name = "North Carolina", Abbr = "NC" },
                new USState() { Name = "North Dakota", Abbr = "ND" },
                new USState() { Name = "Ohio", Abbr = "OH" },
                new USState() { Name = "Oklahoma", Abbr = "OK" },
                new USState() { Name = "Oregon", Abbr = "OR" },
                new USState() { Name = "Pennsylvania", Abbr = "PA" },
                new USState() { Name = "Rhode Island", Abbr = "RI" },
                new USState() { Name = "South Carolina", Abbr = "SC" },
                new USState() { Name = "South Dakota", Abbr = "SD" },
                new USState() { Name = "Tennessee", Abbr = "TN" },
                new USState() { Name = "Texas", Abbr = "TX" },
                new USState() { Name = "Utah", Abbr = "UT" },
                new USState() { Name = "Vermont", Abbr = "VT" },
                new USState() { Name = "Virginia", Abbr = "VA" },
                new USState() { Name = "Washington", Abbr = "WA" },
                new USState() { Name = "West Virginia", Abbr = "WV" },
                new USState() { Name = "Wisconsin", Abbr = "WI" },
                new USState() { Name = "Wyoming", Abbr = "WY" }
            };
            return states;
        }
    }
}
