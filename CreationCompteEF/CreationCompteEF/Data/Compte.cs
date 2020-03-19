using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CreationCompteEF.Data
{
    public class Compte
    {
        public long Id { get; set; }
        public string mail { get; set; }
        private string pass { get; set; }
        private string passConfirm { get; set; }
        public string nom { get; set; }
        public string prenom { get; set; }
        public string poste { get; set; }
        public DateTime dateNaiss { get; set; }
        public string desc { get; set; }

        public String toString()
        {
            String ret = "Compte[";
            ret += "mail : " + mail;
            ret += " nom : " + nom;
            ret += " prenom : " + prenom;
            ret += " poste : " + poste;
            ret += " date de naissance : " + dateNaiss.ToString();
            ret += " description : " + desc;
            ret += "]";
            return ret;
        }

        public void setPass(String pass)
        {
            this.pass = new String(pass);
            this.passConfirm = new String(pass);
        }
    }
}
