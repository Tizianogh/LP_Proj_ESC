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
    public class TypeOpinionsController : ControllerBase
    {
        private readonly ElectionContext _context;

        public TypeOpinionsController(ElectionContext context)
        {
            _context = context;
        }

        // GET: api/TypeOpinions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TypeOpinion>>> GetTypeOpinions()
        {
            return await _context.TypeOpinions.ToListAsync();
        }

        // GET: api/TypeOpinions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TypeOpinion>> GetTypeOpinion(int id)
        {
            var typeOpinion = await _context.TypeOpinions.FindAsync(id);

            if (typeOpinion == null)
            {
                return NotFound();
            }

            return typeOpinion;
        }

        // PUT: api/TypeOpinions/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTypeOpinion(int id, TypeOpinion typeOpinion)
        {
            if (id != typeOpinion.TypeId)
            {
                return BadRequest();
            }

            _context.Entry(typeOpinion).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TypeOpinionExists(id))
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

        // POST: api/TypeOpinions
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<TypeOpinion>> PostTypeOpinion(TypeOpinion typeOpinion)
        {
            _context.TypeOpinions.Add(typeOpinion);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTypeOpinion", new { id = typeOpinion.TypeId }, typeOpinion);
        }

        // DELETE: api/TypeOpinions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<TypeOpinion>> DeleteTypeOpinion(int id)
        {
            var typeOpinion = await _context.TypeOpinions.FindAsync(id);
            if (typeOpinion == null)
            {
                return NotFound();
            }

            _context.TypeOpinions.Remove(typeOpinion);
            await _context.SaveChangesAsync();

            return typeOpinion;
        }

        private bool TypeOpinionExists(int id)
        {
            return _context.TypeOpinions.Any(e => e.TypeId == id);
        }
    }
}
