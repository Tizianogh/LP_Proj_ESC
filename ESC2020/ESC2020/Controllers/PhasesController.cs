using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ESC2020.Model;

namespace ESC2020.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class PhasesController : ControllerBase {
        private readonly ElectionContext _context;

        public PhasesController(ElectionContext context) {
            _context = context;
        }

        // GET: api/Phases
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Phase>>> GetPhases() {
            return await _context.Phases.ToListAsync();
        }

        // GET: api/Phases/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Phase>> GetPhase(int id) {
            var phase = await _context.Phases.FindAsync(id);

            if (phase == null) {
                return NotFound();
            }

            return phase;
        }

        // PUT: api/Phases/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPhase(int id, Phase phase) {
            if (id != phase.PhaseId) {
                return BadRequest();
            }

            _context.Entry(phase).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) {
                if (!PhaseExists(id)) {
                    return NotFound();
                }
                else {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Phases
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Phase>> PostPhase(Phase phase) {
            _context.Phases.Add(phase);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPhase", new { id = phase.PhaseId }, phase);
        }

        // DELETE: api/Phases/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Phase>> DeletePhase(int id) {
            var phase = await _context.Phases.FindAsync(id);
            if (phase == null) {
                return NotFound();
            }

            _context.Phases.Remove(phase);
            await _context.SaveChangesAsync();

            return phase;
        }

        private bool PhaseExists(int id) {
            return _context.Phases.Any(e => e.PhaseId == id);
        }
    }
}
