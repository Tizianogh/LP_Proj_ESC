using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ESC2020.Utils;
using System.Diagnostics;

namespace ESC2020.Model {
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase {
        private readonly ElectionContext _context;

        public UsersController(ElectionContext context) {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Users>>> GetUser() {
            return await _context.User.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Users>> GetUsers(int id) {
            var users = await _context.User.FindAsync(id);

            if (users == null) {
                return NotFound();
            }

            return users;
        }

        [HttpGet]
        [Route("guid/{guid}")]
        public async Task<ActionResult<Users>> GetUserByGuid(Guid guid)
        {
            var users = await _context.User.Where(p => p.AuthUser == guid).FirstOrDefaultAsync();
            Debug.Write(users);

            if (users == null)
            {
                return NotFound();
            }

            return users;
        }

        // GET: api/Users/election/5
        [HttpGet]
        [Route("election/{idElec}")]
        public async Task<ActionResult<IEnumerable<Users>>> GetUsersByElec(int idElec) {
            List<Participant> participants = await _context.Participants.Where(p => p.ElectionId == idElec).ToListAsync();
            List<Users> users = new List<Users>();

            for (int i = 0;i < participants.Count;i++) {
                Users toAdd = _context.User.Find(participants[i].UserId);
                toAdd.AuthorOpinion = null;
                toAdd.ConcernedOpinion = null;
                toAdd.Participants = null;
                toAdd.HostElection = null;
                toAdd.ElectedElection = null;
                toAdd.Message = null;
                if (!users.Contains(toAdd)) {
                    users.Add(toAdd);
                }
            }
            return users;
        }

        // GET: api/Users/connection/5
        [HttpGet]
        [Route("connection")]
        public async Task<ActionResult<Users>> GetUserMailPassword(string mail, string password)
        {
            List<Users> users = await _context.User.ToListAsync();
            foreach (Users user in users)
            {   //Si il trouve un user avec l'email envoyé
                if (user.Email.Equals(mail))
                {
                    //Si le mot de passe correspond au mot de passe envoyé
                    if(HashFunction.verifyPassword(password, user.Password, user.Salt))
                    {
                        return user;
                    }
                }
            }
            return NotFound();
        }


        // PUT: api/Users/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsers(int id, Users users) {
            if (id != users.UserId) {
                return BadRequest();
            }

            _context.Entry(users).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) {
                if (!UsersExists(id)) {
                    return NotFound();
                }
                else {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.

        [HttpPost]
        public async Task<ActionResult<Users>> PostUsers(/*[FromBody] string inputInfos*/Users users)
        {
            //Users users = JsonConvert.DeserializeObject<Users>(inputInfos);
            string hashedPass = HashFunction.hashPassword(users.Password, out string salt);
            users.Password = hashedPass;
            users.Salt = salt;
            _context.User.Add(users);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetUsers", new { id = users.UserId}, users);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Users>> DeleteUsers(int id) {
            var users = await _context.User.FindAsync(id);
            if (users == null) {
                return NotFound();
            }

            _context.User.Remove(users);
            await _context.SaveChangesAsync();

            return users;
        }

        private bool UsersExists(int id) {
            return _context.User.Any(e => e.UserId == id);
        }
    }
}
