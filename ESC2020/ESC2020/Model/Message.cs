using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ESC2020.Model
{
    public class Message
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int MessageId { get; set; }

        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public Users User { get; set; }

        public int ElectionId { get; set; }

        [ForeignKey("ElectionId")]
        public Election Election { get; set; }

        [Required]
        public string Sentence { get; set; } // varchar ?

        [Required]
        public DateTime DateMessage { get; set; } // date?
    }
}
