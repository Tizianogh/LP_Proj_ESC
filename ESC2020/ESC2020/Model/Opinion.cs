using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ESC2020.Model
{
	public class Opinion
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		[Required]
		public int OpinionId { get; set; }

		public int AuthorId { get; set; }

		public int ConcernedId { get; set; }

		[ForeignKey("AuthorId" + "ConcernedId")]
		public Users User { get; set; }

		public int ElectionId { get; set; }

		[ForeignKey("ElectionId")]
		public Election Election { get; set; }

		[Required]
		public string Reason { get; set; }

		public int TypeId { get; set; }

		[ForeignKey("TypeId")]
		public TypeOpinion TypeOpinion { get; set; }

		[Required]
		public DateTime DateOpinion { get; set; }

	}
}
