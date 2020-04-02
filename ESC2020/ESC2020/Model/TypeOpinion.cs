using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESC2020.Model
{
    public class TypeOpinion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int TypeId { get; set; }

        [Required]
        public string OpinionName { get; set; }

        public List<Opinion> Opinion { get; set; } = new List<Opinion>();
    }
}