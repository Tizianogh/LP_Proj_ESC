using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ESC2020.Model;

namespace ESC2020.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OpinionsController : ControllerBase
    {
        private readonly ElectionContext _context;

        public OpinionsController(ElectionContext context)
        {
            _context = context;
        }

        // GET: api/Opinions
        [HttpGet]
        [Route("")]
        public async Task<ActionResult<IEnumerable<Opinion>>> GetOpinions()
        {
            return await _context.Opinions.ToListAsync();
        }

        // GET: api/Opinions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Opinion>> GetOpinion(int id)
        {
            var opinion = await _context.Opinions.FindAsync(id);

            if (opinion == null)
            {
                return NotFound();
            }

            return opinion;
        }

        // GET: api/Opinions/election/5
        [HttpGet]
        [Route("election/{idElec}")]
        public async Task<ActionResult<IEnumerable<Opinion>>> GetOpinionsFromElection(int idElec) {
            var opinion = await _context.Opinions.Where(o => (o.ElectionId == idElec)).ToListAsync();

            if(opinion == null) {
                return NotFound();
            }

            return opinion;
        }

        // GET: api/Opinions/5/5
        [HttpGet]
        [Route("{electionId}/{userId}")]
        public async Task<ActionResult<IEnumerable<Opinion>>> GetOpinionsOfParticipant(int electionId, int userId) {
            return await _context.Opinions.Where(o => o.AuthorId == userId && o.ElectionId == electionId).ToListAsync();
        }

        // GET: api/Opinions/vote/5/5
        [HttpGet]
        [Route("vote/{electionId}/{userId}")]
        public async Task<ActionResult<IEnumerable<Opinion>>> GetVoteOfParticipant(int electionId, int userId) {
            return await _context.Opinions.Where(o => o.AuthorId == userId && o.ElectionId == electionId && o.TypeOpinion.TypeId==1).ToListAsync();
        }

        // GET: api/Opinions/objection/5
        [HttpGet]
        [Route("objection/{electionId}")]
        public async Task<ActionResult<IEnumerable<Opinion>>> GetObjectionsOfElection(int electionId)
        {
            return await _context.Opinions.Where(o => o.ElectionId == electionId && o.TypeOpinion.TypeId == 3).ToListAsync();
        }

        // PUT: api/Opinions/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOpinion(int id, Opinion opinion)
        {
            if (id != opinion.OpinionId)
            {
                return BadRequest();
            }

            _context.Entry(opinion).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OpinionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Opinions
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Opinion>> PostOpinion(Opinion opinion)
        {
            _context.Opinions.Add(opinion);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOpinion", new { id = opinion.OpinionId }, opinion);
        }

        // DELETE: api/Opinions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Opinion>> DeleteOpinion(int id)
        {
            var opinion = await _context.Opinions.FindAsync(id);
            if (opinion == null)
            {
                return NotFound();
            }

            _context.Opinions.Remove(opinion);
            await _context.SaveChangesAsync();

            return opinion;
        }

        private bool OpinionExists(int id)
        {
            return _context.Opinions.Any(e => e.OpinionId == id);
        }
    }
}
