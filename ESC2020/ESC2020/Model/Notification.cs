using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ESC2020.Model
{
    public class Notification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int NotifId { get; set; }

        [Required]
        public string Message { get; set; } // varchar ?

        [Required]
        public DateTimeOffset DateNotification { get; set; } // date ?

        public int ElectionId { get; set; }

        [ForeignKey("ElectionId")]
        public Election Election { get; set; }

    }
}
