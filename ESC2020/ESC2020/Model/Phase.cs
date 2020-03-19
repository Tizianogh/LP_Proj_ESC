using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ESC2020.Model
{
    public class Phase
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int PhaseId { get; set; }

        [Required]
        public string PhaseName { get; set; } // varchar ?

        public List<Election> Election { get; set; } = new List<Election>();
    }
}
