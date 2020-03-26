using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESC2020.Model
{
	public class Users
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		[Required]
		public int UserId { get; set; }

		[Required]
		public string Email { get; set; } // Varchar ?

		[Required]
		public string Password { get; set; } //Char ?

		[Required]
		public string Salt { get; set; }
		
		[Required]
		public DateTime BirthDate { get; set; } //date ?

		[Required]
		public string Description { get; set; } // text ?

		[Required]
		public string FirstName { get; set; } // varchar ?

		[Required]
		public string LastName { get; set; } // varchar ?

		[Required]
		public string Job { get; set; } // varchar ?

		[Required]
		public byte[] Avatar { get; set; }


		public List<Opinion> Opinion { get; set; } = new List<Opinion>();

		public List<Participant> Participants { get; set; } = new List<Participant>();

		public List<Election> Election { get; set; } = new List<Election>();

		public List<Message> Message { get; set; } = new List<Message>();
	}
}