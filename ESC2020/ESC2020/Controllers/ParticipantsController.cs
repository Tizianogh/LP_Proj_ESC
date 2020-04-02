using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ESC2020.Model;
using System.Diagnostics;

namespace ESC2020.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParticipantsController : ControllerBase
    {
        private readonly ElectionContext _context;

        public ParticipantsController(ElectionContext context)
        {
            _context = context;
        }

        // GET: api/Participants
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Participant>>> GetParticipants()
        {
            return await _context.Participants.ToListAsync();
        }

        // GET: api/Participants/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Participant>>> GetParticipantByUser(int id)
        {
            return  await _context.Participants.Where(p => p.UserId == id).ToListAsync();
        }

        // GET: api/Participants/5/5
        [HttpGet]
        [Route("{userId}/{electionId}")]
        public async Task<ActionResult<Participant>> GetParticipant(int userId, int electionId)
        {
            return await _context.Participants.Where(p => p.UserId == userId && p.ElectionId == electionId).FirstOrDefaultAsync();
        }

        // GET: api/Participants/id
        [HttpGet]
        [Route("election/{id}")]
        public async Task<ActionResult<IEnumerable<Participant>>> GetParticipantByElection(int id)
        {
            return await _context.Participants.Where(p => p.ElectionId == id).ToListAsync();
        }

        // PUT: api/Participants/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{userId}/{electionId}")]
        public async Task<IActionResult> PutParticipant(int userId, int electionId, Participant participant)
        {
            if ((userId != participant.UserId) && (electionId != participant.ElectionId))
            {
                Debug.WriteLine("Not found 1" + participant.UserId.ToString() + participant.ElectionId.ToString());

                return BadRequest();
            }

            _context.Entry(participant).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParticipantExists(userId, electionId))
                {
                    Debug.WriteLine("Not found 2");
                    return NotFound();
                }
                else
                {
                    Debug.WriteLine("Not found 3");
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Participants
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Participant>> PostParticipant(Participant participant)
        {
            _context.Participants.Add(participant);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ParticipantExists(participant.UserId, participant.ElectionId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetParticipant", new { userId = participant.UserId, electionId = participant.ElectionId }, participant);
        }

        // DELETE: api/Participants/5
        [HttpDelete("{userId}/{electionId}")]
        public async Task<ActionResult<Participant>> DeleteParticipant(int userId, int electionId)
        {
            var participant = await _context.Participants.FindAsync(userId, electionId);
            if (participant == null)
            {
                return NotFound();
            }

            _context.Participants.Remove(participant);
            await _context.SaveChangesAsync();

            return participant;
        }

        private bool ParticipantExists(int userId, int electionId) 
        {
            return _context.Participants.Any(e => e.UserId == userId && e.ElectionId == electionId);
        }
    }
}
