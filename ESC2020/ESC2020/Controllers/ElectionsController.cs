using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ESC2020.Model;

namespace ESC2020.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class ElectionsController : ControllerBase {
        private readonly ElectionContext _context;

        public ElectionsController(ElectionContext context) {
            _context = context;
        }

        // GET: api/Elections
        [HttpGet]
        [Route("")]
        public async Task<ActionResult<IEnumerable<Election>>> Getelec() {
            return await _context.elec.ToListAsync();
        }

        [HttpGet]
        [Route("code/{code}")]
        public async Task<ActionResult<Election>> Getelec(string code) {
            return await _context.elec.FirstOrDefaultAsync(x => x.CodeElection == code);
        }

        // GET: api/Elections/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Election>> GetElection(int id) {
            var election = await _context.elec.FindAsync(id);

            if (election == null) {
                return NotFound();
            }

            return election;
        }

        //// GET: api/Elections/5/5
        //[HttpGet]
        //[Route("{electionId}/{userId}")]
        //public async Task<ActionResult<Election>> GetElectedUser(int electionId, int userId)
        //{
        //    return await _context.elec.Where(p => p.ElectionId == electionId && p.UserId == userId).FirstOrDefaultAsync();
        //}

        // PUT: api/Elections/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutElection(int id, Election election) {
            if (id != election.ElectionId) {
                return BadRequest();
            }

            _context.Entry(election).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) {
                if (!ElectionExists(id)) {
                    return NotFound();
                }
                else {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Elections
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Election>> PostElection(Election election) {
            if (_context.elec.Any(o => o.CodeElection == election.CodeElection)) {

                return NoContent();
            }
            else {
                _context.elec.Add(election);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetElection", new { id = election.ElectionId }, election);
            }
        }

        // DELETE: api/Elections/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Election>> DeleteElection(int id) {
            var election = await _context.elec.FindAsync(id);
            if (election == null) {
                return NotFound();
            }

            _context.elec.Remove(election);
            await _context.SaveChangesAsync();

            return election;
        }

        private bool ElectionExists(int id) {
            return _context.elec.Any(e => e.ElectionId == id);
        }
    }
}
