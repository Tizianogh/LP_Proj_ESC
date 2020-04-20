using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESC2020.Model
{
    public class Election
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int ElectionId { get; set; }

        [Required]
        public string Job { get; set; } // varchar la donc ?

        [Required]
        public string Mission { get; set; } // text ?

        public string Responsability { get; set; }

        public DateTimeOffset StartDate { get; set; }

        public DateTimeOffset EndDate { get; set; }

        public string CodeElection { get; set; }

        public int HostId { get; set; }
        [ForeignKey("HostId")]
        public Users HostElection { get; set; }

        public int ElectionPhaseId { get; set; }
        [ForeignKey("ElectionPhaseId")]
        public Phase Phase { get; set; }

        public int? ElectedId { get; set; }
        [ForeignKey("ElectedId")]
        public Users ElectedElection { get; set; }

        public List<Notification> Notification { get; set; } = new List<Notification>();

        public List<Message> Message { get; set; } = new List<Message>();

        public List<Opinion> Opinion { get; set; } = new List<Opinion>();

        public List<Participant> Participant { get; set; } = new List<Participant>();
    }
}