using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CreationCompteEF.Data
{
    public class CompteService
    {
        private readonly ApplicationDbContext _db;

        public CompteService(ApplicationDbContext db)
        {
            _db = db;
        }

        public List<Compte> GetComptes()
        {
            var compteListe = _db.comptes.ToList();
            return compteListe;
        }

        public string Create(Compte compte)
        {
            int count = 0;
            foreach(Compte c in GetComptes())
            {
                if (c.mail.Equals(compte.mail))
                {
                    count++;
                }
            }
            if (count == 0)
            {
                _db.Add(compte);
                _db.SaveChanges();
                return "OK";
            }
            else
            {
                return "ALREADY EXISTS";
            }
            
        }

        public Compte GetCompteById(int id)
        {
            Compte compte = _db.comptes.FirstOrDefault(s => s.Id == id);
            return compte;  
        }
    }
}
