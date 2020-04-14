using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ESC2020.Utils {
    public class DataHub : Hub {
        public void GetData() {
            Clients.All.SendAsync("getData", new Random().Next());
        }
    }
}
