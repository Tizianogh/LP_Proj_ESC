﻿

using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESC2020.Model
{
    public class Participant
    {

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public Users User { get; set; }


        [Required]
        public int ElectionId { get; set; }

        [ForeignKey("ElectionId")]
        public Election Elections { get; set; }

        [DefaultValue("false")]
        public bool Proposable { get; set; }
    }
}
