using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ESC2020.ClientApp.src.app.SignalR {
    public class DataHub : Hub {
        public void GetData() {
            Clients.All.InvokeAsync("getData", new Random().Next());
        }
    }
}
